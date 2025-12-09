using QRCoder;


namespace CinemaBookingApp.Helpers.QR_Code
{
    public static class QrCodeGenerator
    {
        //public static byte[] GenerateQrCodeAsByteArray(string content)
        //{
        //    using var qrGenerator = new QRCodeGenerator();
        //    using var qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
        //    using var qrCode = new QRCode(qrCodeData);
        //    using var qrBitmap = qrCode.GetGraphic(20);
        //    using var ms = new MemoryStream();
        //    qrBitmap.Save(ms, ImageFormat.Png);
        //    return ms.ToArray();
        //}
        public static byte[] GenerateQrCodeAsByteArray(string ticketCode, string baseUrl)
        {
                var verifyUrl = $"{baseUrl}/api/ticket/verify/{ticketCode}";

                var qrGenerator = new QRCodeGenerator();
                var qrCodeData = qrGenerator.CreateQrCode(verifyUrl, QRCodeGenerator.ECCLevel.Q);

                var pngByteQRCode = new PngByteQRCode(qrCodeData);
                var qrCodeBytes = pngByteQRCode.GetGraphic(20);

                return qrCodeBytes;
        }
    }

}
