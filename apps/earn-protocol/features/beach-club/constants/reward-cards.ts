import hoodie from '@/public/img/beach_club/hoodie.svg'
import nft from '@/public/img/beach_club/nft.svg'
import tShirt from '@/public/img/beach_club/t_shirt.svg'

export enum BeachClubBoatChallengeRewardCardType {
  T_SHIRT = 't-shirt',
  HOODIE = 'hoodie',
  BEACH_CLUB_NFT = 'beach-club-nft',
}

export const beachClubRewardCardImages = {
  [BeachClubBoatChallengeRewardCardType.T_SHIRT]: tShirt,
  [BeachClubBoatChallengeRewardCardType.HOODIE]: hoodie,
  [BeachClubBoatChallengeRewardCardType.BEACH_CLUB_NFT]: nft,
}

export const beachClubRewardDescriptions = {
  [BeachClubBoatChallengeRewardCardType.T_SHIRT]: 'Beach Club T-shirt',
  [BeachClubBoatChallengeRewardCardType.HOODIE]: 'Limited edition hoodie',
  [BeachClubBoatChallengeRewardCardType.BEACH_CLUB_NFT]: 'Summer.fi Beach Club NFT',
}
