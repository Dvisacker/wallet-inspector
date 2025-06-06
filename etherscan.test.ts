import { EtherscanClient } from "./etherscan";
import dotenv from "dotenv";
import { performance } from "perf_hooks";

dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

if (!ETHERSCAN_API_KEY) {
  throw new Error("ETHERSCAN_API_KEY is not set");
}

describe("EtherscanClient", () => {
  describe("throttling", () => {
    it("should respect rate limiting and concurrency limits", async () => {
      const client = new EtherscanClient(ETHERSCAN_API_KEY, {
        minTimeBetweenRequests: 200, // 5 requests per second
        maxConcurrentRequests: 3,
      });

      const addresses = [
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
      ];

      const startTime = performance.now();

      // Make parallel requests for contract names
      const results = await Promise.all(
        addresses.map((address) => client.getContractName(address, 1))
      );

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Verify results
      expect(results).toHaveLength(addresses.length);
      expect(results.every((name) => typeof name === "string")).toBe(true);
      expect(totalTime).toBeGreaterThanOrEqual(400);

      console.log("Etherscan throttling test results:", {
        totalTime: `${totalTime.toFixed(2)}ms`,
        results,
      });
    }, 1000);

    it("should handle mixed API calls with throttling", async () => {
      const client = new EtherscanClient(ETHERSCAN_API_KEY, {
        minTimeBetweenRequests: 200,
        maxConcurrentRequests: 3,
      });

      const address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC

      const startTime = performance.now();

      const [contractName, contractSource] = await Promise.all([
        client.getContractName(address, 1),
        client.getContractSourceCode(address, 1),
      ]);

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(typeof contractName).toBe("string");
      expect(contractSource).toBeDefined();

      console.log("Etherscan mixed API test results:", {
        totalTime: `${totalTime.toFixed(2)}ms`,
        contractName,
        hasSourceCode: !!contractSource,
      });
    }, 1000);
  });

  describe("proxy detection", () => {
    it("should detect proxy contracts and fetch implementation names", async () => {
      const client = new EtherscanClient(ETHERSCAN_API_KEY, {
        minTimeBetweenRequests: 200,
        maxConcurrentRequests: 3,
      });

      const testCases = [
        {
          address: "0xef4fb24ad0916217251f553c0596f8edc630eb66", // deBridge
          expectedProxyType: "TransparentUpgradeableProxy",
          expectedImplementation: "DlnSource",
        },
        {
          address: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee", // UUPS proxy
          expectedProxyType: "UUPSProxy",
          expectedImplementation: "WeETH",
        },
        {
          address: "0x60acd58d00b2bcc9a8924fdaa54a2f7c0793b3b2", // Beacon proxy
          expectedProxyType: "BeaconProxy",
          expectedImplementation: "NFT20Pair",
        },
      ];

      const startTime = performance.now();

      // Test each proxy contract
      const results = await Promise.all(
        testCases.map(async (testCase) => {
          const name = await client.getContractName(testCase.address, 1);
          return {
            address: testCase.address,
            result: name,
            expectedProxyType: testCase.expectedProxyType,
            expectedImplementation: testCase.expectedImplementation,
          };
        })
      );

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Log results for inspection
      console.log("Proxy detection test results:", {
        totalTime: `${totalTime.toFixed(2)}ms`,
        results: results.map((r) => ({
          address: r.address,
          result: r.result,
          matchesExpected:
            r.result.proxyType === r.expectedProxyType &&
            r.result.implementationName === r.expectedImplementation,
        })),
      });

      // Verify results
      results.forEach((result) => {
        expect(result.result.proxyType).toBe(result.expectedProxyType);
        expect(result.result.implementationName).toBe(
          result.expectedImplementation
        );
      });
    }, 30000); // Increased timeout for multiple API calls
  });
});
