import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

/**
 *
 */
export class KeyVaultSecret {
  keyVaultName: string;
  keyVaultUrl: string;
  keyVaultSdkClient: SecretClient;

  /**
   *
   * @param keyVaultName
   * @param credential - Any @azure/identity credential
   */
  constructor(keyVaultName: string) {
    this.keyVaultName = keyVaultName;

    this.keyVaultUrl = 'https://' + keyVaultName + '.vault.azure.net';
    this.keyVaultSdkClient = new SecretClient(
      this.keyVaultUrl,
      new DefaultAzureCredential()
    );
  }

  async getSecret(secretName: string) {
    return await this.keyVaultSdkClient.getSecret(secretName);
  }
  async setSecret(secretName: string, secretValue: string) {
    return await this.keyVaultSdkClient.setSecret(secretName, secretValue);
  }
  async deleteSerect(secretName: string) {
    return await this.keyVaultSdkClient.beginDeleteSecret(secretName);
  }
}
