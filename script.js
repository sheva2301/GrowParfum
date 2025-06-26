let lastNama = '';
let lastKontak = '';
let lastMetode = '';

const cart = [];

function addToCart(productName, button) {
  const quantityDisplay = button.previousElementSibling.querySelector('.quantity-display');
  const quantity = parseInt(quantityDisplay.textContent);

  // Ambil harga dari elemen HTML
  const priceText = button.parentElement.querySelector('.price').textContent;
  const price = parseInt(priceText.replace(/[^\d]/g, '')); // Menghapus "Rp" dan titik

  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ name: productName, qty: quantity, price: price });
  }

  updateCart();
}




function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.qty * item.price;
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.qty} - Rp${subtotal.toLocaleString('id-ID')}`;
    cartItems.appendChild(li);
    total += subtotal;
  });

  totalPrice.textContent = 'Rp' + total.toLocaleString('id-ID');
}



function changeQuantity(button, delta) {
  const wrapper = button.parentElement;
  const input = wrapper.querySelector('.quantity-display');
  let current = parseInt(input.value);
  current = isNaN(current) ? 1 : current;
  current += delta;
  if (current < 1) current = 1;
  input.value = current;
}



function checkout() {
  if (cart.length === 0) {
    alert('Keranjang kosong!');
    return;
  }

  const nama = prompt("Masukkan nama Anda:");
  const kontak = prompt("Masukkan nomor WhatsApp:");
  const metodeInput = prompt("Pilih metode pembayaran:\n1. Transfer Bank\n2. QRIS\n3. Tunai\n(Ketik angka 1/2/3)");
  const metode = metodeInput ? metodeInput.trim() : '';

  if (!nama || !kontak || !metode) {
    alert("Data tidak lengkap. Mohon isi semua informasi.");
    return;
  }

  let metodeText = '';
  if (metode === '1') metodeText = 'Transfer Bank';
  else if (metode === '2') metodeText = 'QRIS';
  else if (metode === '3') metodeText = 'Tunai';
  else metodeText = 'Tidak diketahui';

  // Simpan data ke localStorage
  const checkoutData = {
    nama: nama,
    kontak: kontak,
    metode: metodeText,
    items: cart
  };

  localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

  // Pindah ke halaman checkout
  window.location.href = 'checkout.html';
}



function printReceipt(nama, kontak, metode) {
  const win = window.open('', 'Struk Pembelian', 'width=700,height=600');

  win.document.write(`
    <html>
      <head>
        <title>Struk Pembelian</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 30px;
            background: #f9f9f9;
            color: #333;
          }
          h2 {
            margin-top: 0;
            color: #2d3748;
          }
          .info {
            margin-bottom: 20px;
          }
          .info p {
            margin: 4px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #e2e8f0;
          }
          tfoot td {
            font-weight: bold;
            background-color: #edf2f7;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <h2>Grow Strong And Hard</h2>
        <div class="info">
          <p><strong>Nama:</strong> ${nama}</p>
          <p><strong>Kontak:</strong> ${kontak}</p>
          <p><strong>Metode Pembayaran:</strong> ${metode}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Produk</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
  `);

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    win.document.write(`
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>Rp${subtotal.toLocaleString('id-ID')}</td>
      </tr>
    `);
  });

  win.document.write(`
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total</td>
              <td>Rp${total.toLocaleString('id-ID')}</td>
            </tr>
          </tfoot>
        </table>
        <div class="footer">
          Terima kasih telah berbelanja bersama kami! 🌿
        </div>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
}

