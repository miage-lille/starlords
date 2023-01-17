import { InMemorySigner } from "@taquito/signer";
import { MichelsonMap, TezosToolkit } from "@taquito/taquito";
import c from 'ansi-colors';
import { Spinner } from "cli-spinner";
import dotenv from "dotenv";
import code from "../build/galaxy.json";
import path from "node:path";
// Read environment variables from .env file
dotenv.config({ path:path.resolve(__dirname,'.env')});
const missingEnvVarLog = (name: string) =>
  console.log(
    c.redBright(`Missing `) +
      c.red.bold.underline(name) +
      c.redBright(` env var. Please add it in `) +
      c.red.bold.underline(`deploy/.env`)
  );

const makeSpinnerOperation = async <T>(
  operation: Promise<T>,
  {
    loadingMessage,
    endMessage,
  }: {
    loadingMessage: string;
    endMessage: string;
  }
): Promise<T> => {
  const spinner = new Spinner(loadingMessage);
  spinner.start();
  const result = await operation;
  spinner.stop();
  console.log("");
  console.log(endMessage);

  return result;
};

const pk = process.env.PK;
const rpcUrl = process.env.RPC_URL;

if (![pk, rpcUrl].find((v) => !!v)) {
  console.log(
    c.redBright(`Couldn't find env variables. Have you filed `) +
      c.red.bold.underline(`deploy/.env` )
  );

  process.exit(-1);
}

if (!pk) {
  missingEnvVarLog("PK");
  process.exit(-1);
}

if (!rpcUrl) {
  missingEnvVarLog("RPC_URL");
  process.exit(-1);
}

// Initialize RPC connection
const Tezos = new TezosToolkit(process.env.RPC_URL || "");

// Deploy to configured node with configured secret key
const deploy = async () => {
  try {
    const signer = await InMemorySigner.fromSecretKey(process.env.PK|| "");

    Tezos.setProvider({ signer });

    // create a JavaScript object to be used as initial storage
    // https://tezostaquito.io/docs/originate/#a-initializing-storage-using-a-plain-old-javascript-object
    const storage = new MichelsonMap();

    const origination = await makeSpinnerOperation(
      Tezos.contract.originate({ code, storage }),
      {
        loadingMessage: c.yellowBright(`Deploying contract`),
        endMessage: c.green(`Contract deployed!`),
      }
    );

    await makeSpinnerOperation(origination.contract(), {
      loadingMessage:
        c.yellowBright(`Waiting for contract to be confirmed at: `) +
        c.yellow.bold(origination.contractAddress || ""),
      endMessage: c.green(`Contract confirmed!`),
    });

    console.log(
      c.green(`\nContract address: \n- `) +
        c.green.underline(`${origination.contractAddress}`)
    );
  } catch (e) {
    console.log("");
    console.log(c.redBright(`Error during deployment:`));
    console.log(e);

    process.exit(1);
  }
};

deploy();