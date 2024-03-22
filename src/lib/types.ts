export type Metadata = {
	name?: string
	description?: string
	icons?: string[]
	url?: string
}

export type ExtendedProvider = {
	session?: {
		peer: {
			metadata: Metadata
		}
		namespaces: {
			eip155: {
				chains: string[]
				methods: string[]
				events: string[]
			}
		}
	}
}

declare global {
	interface Window {
	  ethereum: any; // Define more specifically if possible
	}
  }
  
  export {}; // Ensures this file is treated as a module.