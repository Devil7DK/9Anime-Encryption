using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

public static class Test
{
    public static string Decrypt(string value)
    {
        string keyString = value.Substring(0, 9);
        string encryptedEncodedString = value.Substring(9);
        
        int calculatedIndex = 0;
        int index = 0;

        // #region Decoding
        if ((encryptedEncodedString = Regex.Replace(encryptedEncodedString, "[ \t\n\f\r]", "")).Length % 4 == 0)
        {
            encryptedEncodedString = Regex.Replace(encryptedEncodedString, "==?$", "");
            if (encryptedEncodedString.Length % 4 == 1 || new Regex("[^+/0-9A-Za-z]").IsMatch(encryptedEncodedString))
            {
                return null;
            }
        }

        string encryptedDecodedString = "";

        int offset = 0;
        for (index = 0; index < encryptedEncodedString.Length; index++)
        {
            offset <<= 6;

            int charIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".IndexOf(encryptedEncodedString[index]);
            offset |= charIndex < 0 ? 0 : charIndex;

            if (((index + 1) % 4) == 0)
            {
                encryptedDecodedString += Convert.ToChar((16711680 & offset) >> 16);
                encryptedDecodedString += Convert.ToChar((65280 & offset) >> 8);
                encryptedDecodedString += Convert.ToChar((255 & offset));
                offset = 0;
            }
            if (index == encryptedEncodedString.Length - 1)
            {
                switch (index % 4)
                {
                    case 1:
                        offset >>= 4;
                        encryptedDecodedString += Convert.ToChar(offset);
                        break;
                    case 2:
                        offset >>= 2;
                        encryptedDecodedString += Convert.ToChar((65280 & offset) >> 8);
                        encryptedDecodedString += Convert.ToChar(((255) & offset));
                        break;
                }
            }
        }

        try
        {
            encryptedDecodedString = HttpUtility.UrlDecode(encryptedDecodedString);
        }
        catch (Exception err) { }
        // #endregion

        // #region Decryption
        Dictionary<int, int> tmpArray = Enumerable.Range(0, 256).Select(i => new { Key = i, Value = i }).ToDictionary(x => x.Key, x => x.Value);

        for (index = 0; index < 256; index++)
        {
            calculatedIndex = ((calculatedIndex + tmpArray[index] + Convert.ToUInt16(keyString.ToCharArray()[index % keyString.Length])) % 256);

            int tmp = tmpArray[index];
            tmpArray[index] = tmpArray[calculatedIndex];
            tmpArray[calculatedIndex] = tmp;
        }

        string decryptedDecodedString = "";
        for (int s = calculatedIndex = index = 0; s < encryptedDecodedString.Length; s++)
        {
            calculatedIndex = (calculatedIndex + tmpArray[index = (index + 1) % 256]) % 256;

            int tmp = tmpArray[index];
            tmpArray[index] = tmpArray[calculatedIndex];
            tmpArray[calculatedIndex] = tmp;

            decryptedDecodedString += Convert.ToChar(Convert.ToUInt16(encryptedDecodedString.ToCharArray()[s]) ^ tmpArray[(tmpArray[index] + tmpArray[calculatedIndex]) % 256]);
        }
        // #endregion

        return decryptedDecodedString;
    }

    public static void Main()
    {
        Console.Clear();
        Console.Write("Enter Encrypted String\t:\t");
        string value = Console.ReadLine();
        Console.WriteLine("Decrypted String\t:\t{0}",Decrypt(value));
    }
}
