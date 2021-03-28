import fs from 'fs'
import { createRollingHashs } from '../utils/rolling'

export const createClienteRollingHashes = async (path: any) => {
    const buffer = fs.readFileSync(path);
    const clienteRollingHashes = createRollingHashs(buffer);
    return clienteRollingHashes
}