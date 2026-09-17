export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image payload provided." });
    }

    // Clean base64 string by removing data URL prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Use environment ImgBB API key or default fallback key
    const apiKey =
      process.env.IMGBB_API_KEY ||
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      "3b3fa0e62810a9f5d34208e9d5df6fb5";

    const params = new URLSearchParams();
    params.append("key", apiKey);
    params.append("image", base64Data);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data && data.success && data.data?.url) {
      return res.status(200).json({
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url || data.data.url,
      });
    }

    console.warn("ImgBB API upload notice, utilizing base64 data URL fallback:", data);
    return res.status(200).json({
      success: true,
      url: image,
      fallback: true,
    });
  } catch (err) {
    console.error("Payment screenshot upload error:", err);
    return res.status(200).json({
      success: true,
      url: req.body?.image || "",
      fallback: true,
    });
  }
}
