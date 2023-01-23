import { encryptPassword, passwordsMatch } from "./password"

describe("Password module test suite", () => {
    it("Should encrypt correctly a string then check if it matches", async () => {
        const encryptedPassword = await encryptPassword("Test");
        const matchesPassword = await passwordsMatch("Test", encryptedPassword);
        
        expect(matchesPassword).toBeTruthy();
    })
})