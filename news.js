import Parser from "rss-parser";

export default async function handler(req, res) {
  const parser = new Parser();

  const feeds = [
    "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "https://cointelegraph.com/rss",
    "https://decrypt.co/feed",
    "https://www.theblock.co/rss"
  ];

  const all = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);

      feed.items.slice(0, 5).forEach(item => {
        all.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: feed.title || url,
          contentSnippet:
            item.contentSnippet || item.content || "Sem descrição."
        });
      });

    } catch (err) {
      console.log("Erro no feed:", url, err.message);
    }
  }

  all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.status(200).json({
    ok: true,
    news: all.slice(0, 20)
  });
}
