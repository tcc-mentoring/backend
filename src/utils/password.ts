import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function passwordsMatch(passwordToCompare: string, passwordHash?: string): Promise<boolean> {
    if (!passwordHash) {
        return false;
    }
    return await bcrypt.compare(passwordToCompare, passwordHash);
}