const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * OPay Webhook Handler
 */
async function handleOpayWebhook(req, res) {
  try {
    const signature = req.headers['opay-signature'] || req.headers['x-opay-signature'];
    const webhookSecret = process.env.OPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(401).json({ error: 'Missing signature' });
    }

    const computedSignature = crypto.createHmac('sha512', webhookSecret)
      .update(req.body)
      .digest('hex');

    if (computedSignature !== signature) {
      console.error('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(req.body.toString());
    const { data } = payload;

    if (data && (data.status === 'SUCCESS' || data.status === 'successful')) {
      const orderRef = data.outOrderNo || data.reference;
      const amount = parseFloat(data.amount || 0);

      const { data: tx } = await supabase.from('transactions').select('*').eq('reference', orderRef).single();

      if (tx) {
        await supabase.from('wallets').update({ balance: supabase.raw(`balance + ${amount}`) }).eq('user_id', tx.user_id);
        await supabase.from('transactions').update({ status: 'success' }).eq('id', tx.id);
        console.log(`Wallet funded: ₦${amount}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { handleOpayWebhook };
