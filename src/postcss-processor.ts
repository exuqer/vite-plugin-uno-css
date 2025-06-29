import postcss from 'postcss';
import cssnano from 'cssnano';

export class PostCSSProcessor {
  async optimize(css: string): Promise<string> {
    try {
      const result = await postcss([
        cssnano({
          preset: ['default', {
            discardDuplicates: true,
            mergeRules: true,
            normalizeWhitespace: true
          }]
        })
      ]).process(css, {
        from: undefined
      });

      return result.css;
    } catch (error) {
      console.error('Error optimizing CSS with PostCSS:', error);
      return css;
    }
  }
} 