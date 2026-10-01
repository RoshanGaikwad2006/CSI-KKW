export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send('Missing file id');
  }

  try {
    const driveUrl = `https://lh3.googleusercontent.com/d/${id}`;
    const response = await fetch(driveUrl);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/png';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(Buffer.from(buffer));
    }

    // Fallback URL
    const fallbackUrl = `https://drive.google.com/uc?export=view&id=${id}`;
    const fbResponse = await fetch(fallbackUrl);
    if (fbResponse.ok) {
      const buffer = await fbResponse.arrayBuffer();
      const contentType = fbResponse.headers.get('content-type') || 'image/png';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(Buffer.from(buffer));
    }

    return res.status(response.status).send('Failed to fetch image');
  } catch (error) {
    console.error('Error serving event image:', error);
    return res.status(500).send('Internal server error');
  }
}
