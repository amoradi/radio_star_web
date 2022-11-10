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
        
        console.log(results);
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
        const cid = metadataCids[0];
        console.log('GET >>>', cid);
        console.log('GET >>> 2');

        //((req.query?.cids || '').split(',') || []).forEach(async (cid) => {

        
        console.log('GET >>> 3', cid);
        if (!cid) {
            return [];
        }

        const stream = node.cat(cid);
        const decoder = new TextDecoder();
        let data = ''

        console.log('GET >>> 4', stream);
        for await (const chunk of stream) {
            // chunks of data are returned as a Uint8Array, convert it back to a string
            console.log('GET >>> 5');
            data += decoder.decode(chunk, { stream: true });
        }

        console.log('GET >>> 6');
        songsMetadata.push(data);
        
        console.log('songsMetadata >>', songsMetadata)
        return songsMetadata;
    } catch(e) {
        return [];
    }
}
