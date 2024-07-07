import {
    percentAmount,
    generateSigner,
    signerIdentity,
    createSignerFromKeypair,
  } from "@metaplex-foundation/umi";
  import {
    TokenStandard,
    createAndMint,
    mplTokenMetadata,
  } from "@metaplex-foundation/mpl-token-metadata";
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  import { RPC_URL, secret} from "./config";
  import bs58 from "bs58"
  const umi = createUmi(RPC_URL); //Replace with your QuickNode RPC Endpoint
  
  const userWallet = umi.eddsa.createKeypairFromSecretKey(bs58.decode(secret));
  const userWalletSigner = createSignerFromKeypair(umi, userWallet);
  const metadata = {
    name: "HLP TOKEN",
    symbol: "hlp",
    uri: "https://arweave.net/",
  };
  const mint = generateSigner(umi);
  umi.use(signerIdentity(userWalletSigner));
  umi.use(mplTokenMetadata());
  createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 0,
    amount: 50000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
  })
    .sendAndConfirm(umi)
    .then(() => {
      console.log("Successfully (", mint.publicKey, ")");
    })
    .catch((err) => {
      console.error("Error minting tokens:", err);
    });