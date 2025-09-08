class GlobalController {
  constructor(dao) {
    this.dao = dao;
  }

  async create(req, res) {
    try {
      const document = await this.dao.create(req.body);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async read(req, res) {
    try {
      const document = await this.dao.read(req.params.id);
      res.status(200).json(document);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const document = await this.dao.update(req.params.id, req.body);
      res.status(200).json(document);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const document = await this.dao.delete(req.params.id);
      res.status(200).json(document);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const documents = await this.dao.getAll();
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = GlobalController;
