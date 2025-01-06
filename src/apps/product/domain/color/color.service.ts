import { BaseService } from "../../../../librairies/services/base.service";
import { ColorRepository } from "../../data-access/color/color.repository";
import { IColor } from "../../data-access/color/color.interface";

export class ColorService extends BaseService {
  private repository: ColorRepository;

  constructor() {
    super("Color");
    this.repository = new ColorRepository();
  }

  async createColor(data: Partial<IColor>): Promise<IColor> {
    return this.repository.create(data);
  }

  async getColorById(id: string): Promise<IColor> {
    const color = await this.repository.getById(id);
    return this.validateDataExists(color, id);
  }

  async getAllColors(): Promise<IColor[]> {
    return this.repository.getAll();
  }

  async updateColorById(id: string, updates: Partial<IColor>): Promise<IColor> {
    const updatedColor = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedColor, id);
  }

  async deleteColorById(id: string): Promise<IColor> {
    const deletedColor = await this.repository.deleteById(id);
    return this.validateDataExists(deletedColor, id);
  }

  async deleteMultipleColors(ids: string[]): Promise<void> {
    const result = await this.repository.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount !== ids.length) {
      throw new Error(`Some colors could not be deleted.`);
    }
  }
}
