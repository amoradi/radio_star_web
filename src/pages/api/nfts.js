const mockDataStore = {
  /* artist address: song  mapping */
};

export default function handler(req, res) {
    if (req.method === 'POST') {
      // Just post a single NFT for demo's sake and not a list of NFTs.
      // If this was a real API, I'd allow for N NFTs.
      const { body } = req;

      //
      // Santize data
      // (skip for demo's sake)
      //

      //
      // Insert nft into data store, keyed by artist address.
      // 
      const insertData = {
        token_id: body.tokenId,
        description: body.description,
        image: body.image, // The song cover art.
        name: body.name,
        animation: body.animation, // The song file.
        attributes: [
          {
            // Are these supposed to be the same values?
            trait_type: body.artistName,
            value: body.artistName,
          }
        ]
      };

      if (!mockDataStore[body.artistAddress]) {
        mockDataStore[body.artistAddress] = [];
      }

      mockDataStore[body.artistAddress].push(insertData);

      console.dir(mockDataStore);
      
      //
      // Return response payload with "url" asset members.
      //
      // TODO: Well-form url endpoints. Make GET endpoints for /nfts/image/ and /nfts/animation
      // Should these be relative?
      const responseData = { ...insertData, image_url: `/api/nfts/image/${body.artistAddress}/${body.tokenId}`, animation_url: `/api/nfts/animation/${body.artistAddress}/${body.tokenId}`, };
      delete responseData.image;
      delete responseData.animation;

      res.status(200).json(responseData);
    } else {
      // Handle any other HTTP method
      res.status(400).json({});
    }
  }

  export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}