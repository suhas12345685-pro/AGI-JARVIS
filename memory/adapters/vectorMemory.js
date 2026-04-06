const { ChromaClient } = require('chromadb');
const logger = require('../../shared/logger');

class VectorMemory {
  constructor() {
    const chromaUrl = process.env.CHROMA_URL || 'http://localhost:8000';
    const url = new URL(chromaUrl);
    this.client = new ChromaClient({
      host: url.hostname,
      port: parseInt(url.port, 10) || 8000,
      ssl: url.protocol === 'https:',
    });
    this.collectionName = 'jarvis_memory';
    this.collection = null;
    this.ready = false;
  }

  async init() {
    try {
      this.collection = await this.client.getOrCreateCollection({
        name: this.collectionName,
        metadata: { 'hnsw:space': 'cosine' }
      });
      this.ready = true;
      logger.info('Vector memory (ChromaDB) connected');
    } catch (err) {
      logger.warn(`ChromaDB connection failed: ${err.message}. Vector memory disabled.`);
    }
  }

  async store(id, text, metadata = {}) {
    if (!this.ready) return;
    await this.collection.upsert({
      ids: [id],
      documents: [text],
      metadatas: [{ ...metadata, timestamp: Date.now() }]
    });
  }

  async search(query, topK = 5) {
    if (!this.ready) return [];
    try {
      const results = await this.collection.query({
        queryTexts: [query],
        nResults: topK,
      });
      return results.documents[0].map((doc, i) => ({
        text: doc,
        distance: results.distances[0][i],
        metadata: results.metadatas[0][i]
      }));
    } catch (err) {
      logger.warn(`Vector search failed: ${err.message}`);
      return [];
    }
  }
}

module.exports = new VectorMemory();
