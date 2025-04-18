import { TestBed } from '@angular/core/testing';
import { TranslocoRootModule } from './transloco-root.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslocoModule, TRANSLOCO_CONFIG, TRANSLOCO_LOADER } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-root.module';

describe('TranslocoRootModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslocoRootModule
      ]
    });
  });

  it('should provide TRANSLOCO_CONFIG', () => {
    const config = TestBed.inject(TRANSLOCO_CONFIG);
    expect(config).toBeTruthy();
    expect(config.availableLangs).toEqual(['de', 'en']);
    expect(config.defaultLang).toBe('de');
    expect(config.reRenderOnLangChange).toBe(true);
  });

  it('should provide TRANSLOCO_LOADER', () => {
    const loader = TestBed.inject(TRANSLOCO_LOADER);
    expect(loader).toBeTruthy();
    expect(loader instanceof TranslocoHttpLoader).toBe(true);
  });

  it('should export TranslocoModule', () => {
    const module = TestBed.inject(TranslocoModule);
    expect(module).toBeTruthy();
  });
});

describe('TranslocoHttpLoader', () => {
  let loader: TranslocoHttpLoader;
  let httpMock: { get: jest.Mock };

  beforeEach(() => {
    httpMock = { get: jest.fn() };
    loader = new TranslocoHttpLoader(httpMock as any);
  });

  it('should be created', () => {
    expect(loader).toBeTruthy();
  });

  it('should load translation for a language', () => {
    const mockResponse = { key: 'value' };
    httpMock.get.mockReturnValue(mockResponse);

    const result = loader.getTranslation('en');
    expect(result).toEqual(mockResponse);
    expect(httpMock.get).toHaveBeenCalledWith('/assets/i18n/en.json');
  });
});