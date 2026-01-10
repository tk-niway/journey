import yaml from 'js-yaml';
import app from '@api/index';
import { OPENAPI_INFO } from '@consts/openapi-info';
import { writeFileSync } from 'fs';

export default function generateOpenApiYml() {
  const pathFile = '../../shared/openapi.yml';

  console.log('Generating OpenAPI YAML file... to ' + pathFile);

  writeFileSync(pathFile, yaml.dump(app.getOpenAPIDocument(OPENAPI_INFO)));

  console.log('OpenAPI YAML file generated successfully. at ' + pathFile);
}
