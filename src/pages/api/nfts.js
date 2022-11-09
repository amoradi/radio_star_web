import * as IPFS from 'ipfs-core';

export default async function handler(req, res) {
    try {
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
          // token_id: body.tokenId,
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

        // Add to IPFS
        const node = await IPFS.create()
        const data = JSON.stringify(insertData);
        const results = await node.add(data);
        const cid = results?.path || null;
      
        if (cid === null) {
          res.status(400).json({ ...insertData, cid: null });
        } else {
          res.status(200).json({ ...insertData, cid });
        }
      } else {
        // Handle any other HTTP method
        res.status(400).json({});
      }
    } catch(e) {
      res.status(500);
    }
  }

  export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}