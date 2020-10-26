import sendGrid from '@sendgrid/mail';
import { SENDGRID_API_KEY, EMAIL_SENDING_DETAILS } from '../../config';
import { EMAIL_TEMPLATES } from '../../lib/constants';

class Mailer {
  
  constructor() {
    sendGrid.setApiKey(SENDGRID_API_KEY);
  }

  send = (email) => sendGrid.send(email);

  generateEmail = (user, emailType, extraArgs) => {
    const template = EMAIL_TEMPLATES[emailType];
    const { ADMIN_EMAIL, COPYRIGHT_YEAR } = EMAIL_SENDING_DETAILS;
    return {
      from: {email: ADMIN_EMAIL, name: 'User Module'},
      to: user.email,
      subject: template.subject,
      templateId: template.templateId,
      dynamicTemplateData: {
        subject: template.subject,
        username: user.username,
        copyYear: COPYRIGHT_YEAR,
        ...template.args,
        ...extraArgs
      }
    };
  }
}

export default new Mailer();