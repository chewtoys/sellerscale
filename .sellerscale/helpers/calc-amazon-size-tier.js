const TIERS = [
  {
    name: 'small',
    weight: 0.75,
    longestSide: 15,
    medianSide: 12,
    shortestSide: 0.75,
    lengthPlusGirth: null,
  },
  {
    name: 'large',
    weight: 20,
    longestSide: 18,
    medianSide: 14,
    shortestSide: 8,
    lengthPlusGirth: null,
  },
  {
    name: 'smallOversize',
    weight: 70,
    longestSide: 60,
    medianSide: 30,
    shortestSide: null,
    lengthPlusGirth: 130,
  },
  {
    name: 'mediumOversize',
    weight: 150,
    longestSide: 108,
    medianSide: null,
    shortestSide: null,
    lengthPlusGirth: 130,
  },
  {
    name: 'largeOversize',
    weight: 150,
    longestSide: 108,
    medianSide: null,
    shortestSide: null,
    lengthPlusGirth: 165,
  },
];

function getLongestSide(productData) {
  return Math.max(productData.height, productData.length, productData.width);
}

function getShortestSide(productData) {
  return Math.min(productData.height, productData.length, productData.width);
}

function getMedianSide(productData) {
  return [productData.height, productData.length, productData.width].sort()[1];
}

function getLengthPlusGirth(productData) {
  const length = getLongestSide(productData);
  const girth = (getMedianSide(productData) + getShortestSide(productData)) * 2;

  return length + girth;
}

export default function calcAmazonSizeTier(productData) {
  const foundTier = TIERS.find(tier => productData.weight <= tier.weight
      && (tier.longestSide ? getLongestSide(productData) <= tier.longestSide : true)
      && (tier.medianSide ? getMedianSide(productData) <= tier.medianSide : true)
      && (tier.shortestSide ? getShortestSide(productData) <= tier.shortestSide : true)
      && (tier.lengthPlusGirth ? getLengthPlusGirth(productData) <= tier.lengthPlusGirth : true));

  return foundTier ? foundTier.name : 'specialOversize';
}
