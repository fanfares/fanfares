import { formatFilePrefixedName } from "./utils";

export interface MessageSignRequest {
  fileNames: string;
}

export interface MessageSignResponse {
  storageAccount: string;
  signer: string;
  signature: string;
  message: string;
  postEndpoint: string;
  fileNamesHashed: string;
}

function formatFileNames(fileNames: string[]): string {
  return fileNames.join(",");
}



export async function uploadToShdwDrive(
  files: File[],
  fileNamePrefix?: string
): Promise<string[]> {
  try {
    // Format File Names
    const fileNameArray = files.map((file) =>
      formatFilePrefixedName(file, fileNamePrefix)
    );
    const fileNames = formatFileNames(fileNameArray);

    // Create Form Data
    const formData = new FormData();

    // Add Files
    for (let i = 0; i < files.length; i++) {
      formData.append(
        "file",
        files[i],
        formatFilePrefixedName(files[i], fileNamePrefix)
      );
    }

    // Sign Message
    const signMessageRequest: MessageSignRequest = { fileNames };
    const signMessageResponse = await fetch(`/api/sign`, {
      method: "POST",
      body: JSON.stringify(signMessageRequest),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check Response
    if (!signMessageResponse.ok) throw new Error("Failed to sign message");

    // Finish Form Data
    const signedMessage: MessageSignResponse = await signMessageResponse.json();
    const { signer, signature, storageAccount, postEndpoint } = signedMessage;

    console.log(signedMessage);

    formData.append("message", signature);
    formData.append("signer", signer);
    formData.append("storage_account", storageAccount);
    formData.append("fileNames", fileNames);

    // Upload
    const uploadResponse = await fetch(postEndpoint, {
      method: "POST",
      body: formData,
    });

    // Check Upload
    if (!uploadResponse.ok) throw new Error("Failed to upload files");

    // Grab final urls
    const finalUrls = (await uploadResponse.json()).finalized_locations;

    if (!finalUrls) throw new Error("Failed to retrieve final urls");

    return finalUrls;
  } catch (e) {
    // So sentry can catch the error
    throw new Error(`Failed to upload to SHDW Drive - ${e}`);
  }
}
