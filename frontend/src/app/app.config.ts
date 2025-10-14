import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Add these lines
    provideHttpClient(),
    importProvidersFrom(FormsModule)
  ]
};
