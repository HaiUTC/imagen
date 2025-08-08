import { Box, Button, InlineStack } from "@shopify/polaris";
import { ICONS, svgIcon } from "../../../libs/constants/icons";
import styles from "./library.module.css";
import { ImagenLibraryPreview } from "./preview";

export interface LibraryProps {
  isSticky: boolean;
}

export const Library: React.FC<LibraryProps> = ({ isSticky }) => {
  return (
    <Box paddingBlock="1000">
      <div
        className={styles.container}
        style={{ top: isSticky ? "65px" : "120px" }}
      >
        <InlineStack gap="200">
          <Box paddingInlineEnd="100">
            <InlineStack gap="150">
              <button className={styles.search}>{svgIcon(ICONS.SEARCH)}</button>
              <Button variant="tertiary">Explore</Button>
            </InlineStack>
          </Box>
          <Box borderInlineEndWidth="025" borderColor="border-hover"></Box>
          <Box paddingInlineStart="100">
            <InlineStack gap="200">
              <Button variant="tertiary">Soul</Button>
              <Button variant="tertiary">Soul</Button>
              <Button variant="tertiary">Soul</Button>
              <Button variant="tertiary">Soul</Button>
              <Button variant="tertiary">Soul</Button>
            </InlineStack>
          </Box>
        </InlineStack>
      </div>

      <Box>
        <div className={styles.masonry}>
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/okRPobcFQX-8R-nCnx7DQA" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/tUBu1Nv5SmiLSYDDt5AV9w" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/dyinZZPOTDK3nWnfkspWbg" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/e2UNr7ZURF2VpXk13NVAAw" />

          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/yLOrMZvSSxKaIffGEtOmKQ" />

          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/aAIcIT4VRjiFl6L9C6D8Sw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/u1_1ab5ASve0JA6I6F-Awg" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/VxKcdEIHSh25E_ZhZyDNFQ" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/r1DJeoWYRJCYzyHvGeu-kQ" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/NxiKSMPsTEyp7mUdC_TrEw" />

          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/asjUhkUoQDu_R402K_2qGw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/8j9aWFwETQidD7-4kvOiJw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/NxiKSMPsTEyp7mUdC_TrEw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/kMEGdk4PTY2OrJxYT2-hIw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/u1_1ab5ASve0JA6I6F-Awg" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/PpAKyzzNTqW4t4rgD2Rw8w" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/zZ2hF1GER1Gil4go0fxXgw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/VxKcdEIHSh25E_ZhZyDNFQ" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/aSV8Fmr1Tz-AwS3UdBXGEw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/rrtlgZIwRw6vG-VOz_DCTg" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/rcPtuvxCSSe3HnhepyO__w" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/j0_7RwkmRo-yK6jcihbTvw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/mrFDTfExTE23J4k0U34AHw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/MfBY61r-TkOVnByNApox7Q" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/sUjhKzTbQmCXhtEu4vm_Fg" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/PpAKyzzNTqW4t4rgD2Rw8w" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/zZ2hF1GER1Gil4go0fxXgw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/VxKcdEIHSh25E_ZhZyDNFQ" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/aSV8Fmr1Tz-AwS3UdBXGEw" />
          <ImagenLibraryPreview src="https://ideogram.ai/assets/progressive-image/balanced/response/rrtlgZIwRw6vG-VOz_DCTg" />
        </div>
      </Box>
    </Box>
  );
};
