// Bridge Transaction Types
export interface BridgeTransaction {
  txHash: string;
  destTxHash?: string;
  bridge: string;
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  fromSymbol: string;
  toSymbol: string;
  sender: string;
  recipient: string;
  timestamp: number;
  status: "pending" | "completed" | "failed";
  fees?: string;
  blockNumber: number;
  destBlockNumber?: number;
}

export interface BridgeProvider {
  name: string;
  fetchTransactions(address: string): Promise<BridgeTransaction[]>;
}

// Lifi API Types
export interface LifiTransfer {
  transactionId: string;
  fromChain: {
    id: number;
    name: string;
  };
  toChain: {
    id: number;
    name: string;
  };
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  fromAmount: string;
  toAmount: string;
  sendingWalletAddress: string;
  receivingWalletAddress: string;
  timestamp: number;
  status: string;
  toolDetails: {
    name: string;
  };
  transactionHash?: string;
  destinationTransactionHash?: string;
  fees?: Array<{
    amount: string;
    token: {
      symbol: string;
    };
  }>;
}

export interface LifiResponse {
  transfers: LifiTransfer[];
}

// Socket API Types
export interface SocketTransfer {
  _id: string;
  srcTransactionHash: string;
  destTransactionHash?: string;
  bridgeName: string;
  fromChainId: number;
  toChainId: number;
  srcTokenAddress: string;
  destTokenAddress: string;
  srcAmount: string;
  destAmount?: string;
  srcTokenSymbol: string;
  destTokenSymbol?: string;
  sender: string;
  recipient: string;
  srcBlockTimeStamp: number;
  destBlockTimeStamp?: number;
  srcTxStatus: string;
  destTxStatus?: string;
  fees?: string;
  srcBlockNumber: number;
  destBlockNumber?: number;
}

export interface SocketResponse {
  success: boolean;
  result: SocketTransfer[];
  paginationData: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
}

// DLN API Types
export interface DlnOrder {
  orderId: string;
  makerOrderNonce: string;
  makerSrc: string;
  giveChainId: number;
  giveTokenAddress: string;
  giveAmount: string;
  takeChainId: number;
  takeTokenAddress: string;
  takeAmount: string;
  receiverDst: string;
  givePatchAuthoritySrc: string;
  orderAuthorityAddressDst: string;
  allowedTakerDst: string;
  externalCall: any;
  allowedCancelBeneficiarySrc: string;
  createdAt: string;
  state: string;
  fulfilledAt?: string;
  cancelledAt?: string;
  fulfillTx?: {
    txHash: string;
    blockNumber: number;
  };
  createTx: {
    txHash: string;
    blockNumber: number;
  };
}

export interface DlnResponse {
  orders: DlnOrder[];
  pagination: {
    take: number;
    skip: number;
    total: number;
  };
}

// Relay API Types
export interface RelayRequest {
  id: string;
  user: string;
  originChainId: number;
  destinationChainId: number;
  currency: string;
  amount: string;
  recipient: string;
  fees: {
    relayer: string;
    app: string;
  };
  createdAt: string;
  status: string;
  hash: string;
  destinationTxHash?: string;
  blockNumber: number;
  destinationBlockNumber?: number;
}

export interface RelayResponse {
  requests: RelayRequest[];
}

// LayerZero API Types
export interface LayerZeroMessage {
  pathway: {
    srcEid: number;
    dstEid: number;
    sender: {
      address: string;
      id: string;
      name: string;
      chain: string;
    };
    receiver: {
      address: string;
      id: string;
      name: string;
      chain: string;
    };
    id: string;
    nonce: number;
  };
  source: {
    status: string;
    tx: {
      txHash: string;
      blockHash: string;
      blockNumber: string;
      blockTimestamp: number;
      from: string;
      blockConfirmations: number;
      payload: string;
      value: string;
      readinessTimestamp: number;
      resolvedPayload: string;
      adapterParams: {
        version: string;
        dstGasLimit: string;
        dstNativeGasTransferAmount: string;
        dstNativeGasTransferAddress: string;
      };
      options: {
        lzReceive: {
          gas: string;
          value: string;
        };
        nativeDrop: Array<{
          amount: string;
          receiver: string;
        }>;
        compose: Array<{
          index: number;
          gas: string;
          value: string;
        }>;
        ordered: boolean;
      };
    };
    failedTx: string[];
  };
  destination: {
    status: string;
    tx: {
      txHash: string;
      blockHash: string;
      blockNumber: number;
      blockTimestamp: number;
    };
    payloadStoredTx: string;
    failedTx: string[];
  };
  verification: {
    dvn: {
      dvns: Record<
        string,
        {
          txHash: string;
          blockHash: string;
          blockNumber: number;
          blockTimestamp: number;
          proof: {
            packetHeader: string;
            payloadHash: string;
          };
          optional: boolean;
          status: string;
        }
      >;
      status: string;
    };
    sealer: {
      tx: {
        txHash: string;
        blockHash: string;
        blockNumber: number;
        blockTimestamp: number;
      };
      failedTx: Array<{
        txHash: string;
        txError: string;
      }>;
      status: string;
    };
  };
  guid: string;
  config: {
    error: boolean;
    errorMessage: string;
    dvnConfigError: boolean;
    receiveLibrary: string;
    sendLibrary: string;
    inboundConfig: {
      confirmations: number;
      requiredDVNCount: number;
      optionalDVNCount: number;
      optionalDVNThreshold: number;
      requiredDVNs: string[];
      requiredDVNNames: string[];
      optionalDVNs: string[];
      optionalDVNNames: string[];
      executor: string;
    };
    outboundConfig: {
      confirmations: number;
      requiredDVNCount: number;
      optionalDVNCount: number;
      optionalDVNThreshold: number;
      requiredDVNs: string[];
      requiredDVNNames: string[];
      optionalDVNs: string[];
      optionalDVNNames: string[];
      executor: string;
    };
    ulnSendVersion: string;
    ulnReceiveVersion: string;
  };
  status: {
    name: string;
    message: string;
  };
  created: string;
  updated: string;
}

export interface LayerZeroResponse {
  data: LayerZeroMessage[];
  nextToken?: string;
}
