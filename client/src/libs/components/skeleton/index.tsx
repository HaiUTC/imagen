import { Grid, InlineStack } from '@shopify/polaris';
import styles from './skeleton.module.css';

interface SkeletonImageGeneratedProps {
  n: number;
}

export const SkeletonImageGenerated: React.FC<SkeletonImageGeneratedProps> = ({ n }) => {
  return (
    <InlineStack gap="100" wrap={false}>
      <Grid columns={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }} gap={{ xs: '8px', sm: '8px', md: '8px', lg: '8px', xl: '8px' }}>
        {Array.from({ length: n }).map((_, index) => (
          <Grid.Cell key={index}>
            <div className={styles.container}>
              <img
                className={styles.image}
                src="https://cdn.shopify.com/s/files/1/0738/3003/9772/files/blank_image.svg?v=1749703806"
                alt="Skeleton"
              />

              <div
                className={styles.xo_loader_1}
                style={
                  {
                    '--color': '#000',
                    '--duration': '1111',
                    '--size': '40',
                  } as React.CSSProperties
                }
              >
                <span></span>
              </div>
            </div>
          </Grid.Cell>
        ))}
      </Grid>
    </InlineStack>
  );
};
