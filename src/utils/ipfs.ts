export async function add(node, body) {
    try {
        const insertData = {
            // token_id: body.tokenId,
            description: body.description,
            image: body.image, // Song cover art.
            name: body.name,
            animation: body.animation, // Song file.
            attributes: [
                    {
                    // Are these supposed to be the same values?
                    trait_type: body.artistName,
                    value: body.artistName,
                    }
                ]
        };
  
        const data = JSON.stringify(insertData);
        const results = await node.add(data);
        const cid = results?.path || null;
        
        // "results" example type:
        //
        // path: 'QmagygrSKgPt6iFbhc8u9s2JmDqLH3iHDNBLVtKtu9Ky7r',
        // cid: CID(QmagygrSKgPt6iFbhc8u9s2JmDqLH3iHDNBLVtKtu9Ky7r),
        // size: 1263094,
        // mode: 420,
        // mtime: undefined

        return cid;
    } catch(e) {
        return null;
    }
}

export async function get(node, metadataCids = []) {
    try {
        const songsMetadata = [];
        // Just get 1st one for now. TODO: Fix this.
        for (let i = 0, ii = metadataCids.length; i < ii; i++) {
            const cid = metadataCids[i];
           
            if (!cid) {
                return [];
            }

            const stream = node.cat(cid);
            const decoder = new TextDecoder();
            let data = ''

            for await (const chunk of stream) {
                // chunks of data are returned as a Uint8Array, convert it back to a string
                data += decoder.decode(chunk, { stream: true });
            }

            songsMetadata.push(data);
        };
        
        return songsMetadata;
    } catch(e) {
        return [];
    }
}
