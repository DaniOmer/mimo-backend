import BadRequestError from "../../config/error/bad.request.config";
import NotificationStrategy from "../../config/notification/notification.strategy";
import NotificationStrategyFactory from "../../config/notification/notification.factory";

export class BaseService {
  private entityName: string;
  readonly emailNotifier: NotificationStrategy;
  readonly smsNotifier: NotificationStrategy;

  constructor(entityName: string) {
    this.entityName = entityName;
    this.emailNotifier = NotificationStrategyFactory.create("email");
    this.smsNotifier = NotificationStrategyFactory.create("sms");
  }

  protected validateDataExists<D>(data: D | null, id: string): D {
    if (!data) {
      throw new BadRequestError({
        message: `${this.entityName} not found for ID: ${id}`,
        code: 404,
      });
    }
    return data;
  }
}
