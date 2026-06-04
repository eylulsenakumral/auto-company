import templatesData from '../templates.json';

export interface Template {
  id: string;
  name: string;
  category: string;
  price_stars: number;
  description: string;
  notion_url: string;
  thumbnail: string;
  tags: string[];
  features: string[];
}

export class TemplateCatalog {
  private templates: Template[];

  constructor() {
    this.templates = templatesData as Template[];
  }

  getAll(): Template[] {
    return this.templates;
  }

  getById(id: string): Template | undefined {
    return this.templates.find(t => t.id === id);
  }

  getByCategory(category: string): Template[] {
    return this.templates.filter(t => t.category === category);
  }

  getCategories(): string[] {
    return Array.from(new Set(this.templates.map(t => t.category)));
  }

  search(query: string): Template[] {
    const lowerQuery = query.toLowerCase();
    return this.templates.filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}
