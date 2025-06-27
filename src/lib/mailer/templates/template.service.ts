import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TemplateService {
  private readonly basePath = join(__dirname);

  render(templatePath: string, variables: Record<string, any>): string {
    const fullPath = join(this.basePath, templatePath);
    const fileContent = readFileSync(fullPath, 'utf8');
    const compiled = handlebars.compile(fileContent);
    return compiled(variables);
  }
}
