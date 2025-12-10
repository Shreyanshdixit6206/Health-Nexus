// Simple integration flow test for Health NEXUS backend
// Uses global fetch available in Node 18+

const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3000/api';

async function main(){
  try{
    console.log('Checking /medicines...');
    let res = await fetch(BASE + '/medicines');
    let j = await res.json();
    console.log('medicines count:', (j.medicines||[]).length);

    const aadhaar = '123412341234';
    console.log('Requesting OTP for', aadhaar);
    res = await fetch(BASE + '/login-request', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ aadhaar }) });
    j = await res.json();
    if (!res.ok) throw new Error('login-request failed: ' + (j.error||JSON.stringify(j)));
    const otp = j.devOtp;
    console.log('Got devOtp:', otp);

    console.log('Verifying OTP...');
    res = await fetch(BASE + '/verify-otp', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ aadhaar, otp }) });
    j = await res.json();
    if (!res.ok) throw new Error('verify-otp failed: ' + (j.error||JSON.stringify(j)));
    const token = j.token;
    console.log('Got token for user', j.user && j.user.id);

    console.log('Placing an order...');
    const order = { items: [ { id: 'm1', qty: 1 } ], total: 25, address: 'Test Address' };
    res = await fetch(BASE + '/orders', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(order) });
    j = await res.json();
    if (!res.ok) throw new Error('place order failed: ' + (j.error||JSON.stringify(j)));
    console.log('Order placed id:', j.order && j.order.id);

    console.log('Fetching orders...');
    res = await fetch(BASE + '/orders', { headers: { Authorization: 'Bearer ' + token } });
    j = await res.json();
    if (!res.ok) throw new Error('get orders failed');
    console.log('Orders count for user:', (j.orders||[]).length);

    console.log('Integration flow completed successfully');
    process.exit(0);
  }catch(err){
    console.error('Test flow failed:', err && err.message || err);
    process.exit(2);
  }
}

main();
