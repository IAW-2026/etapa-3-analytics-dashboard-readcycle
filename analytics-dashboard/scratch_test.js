async function test() {
  const url = "https://proyecto-c-shipping-readcycle.vercel.app/api/shipments/";
  const apiKey = "apitoken_readcycle_2026";
  const headers = { "x-api-key": apiKey };

  try {
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      console.log(`Total shipments received: ${data.length}`);
      
      const statuses = new Set();
      const detailedStatuses = {};
      const carrierIds = new Set();
      
      data.forEach(item => {
        statuses.add(item.currentStatus);
        
        if (!detailedStatuses[item.currentStatus]) {
          detailedStatuses[item.currentStatus] = 0;
        }
        detailedStatuses[item.currentStatus]++;
        
        if (item.carrierId) {
          carrierIds.add(item.carrierId);
        }
      });
      
      console.log("Unique statuses:", Array.from(statuses));
      console.log("Status counts:", detailedStatuses);
      console.log("Unique carrier IDs count:", carrierIds.size);
      console.log("All shipments:");
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(`Failed: ${res.status}`);
    }
  } catch (e) {
    console.error(e);
  }
}

test();
