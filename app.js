/* =====================================================
   DORIS DELIGHT VENTURES — app.js
   Sections: PRODUCT DATA -> RENDER -> MODAL/ORDER LOGIC -> NAV -> INIT
   Edit the CAKES and SNACKS arrays below to add, remove or reprice products.
   ===================================================== */

/* ===================== BUSINESS INFO ===================== */
/* Update these if the phone numbers or Facebook name ever change. */
const BUSINESS = {
  name: "Doris Delight Ventures",
  phonePrimary: "08122347141",     // used for WhatsApp ordering
  phoneSecondary: "08082423446",
  whatsappNumber: "2348122347141", // international format, no + or leading 0
  facebookName: "Oyewole Dorcas",
  facebookUrl: "#",                // replace "#" with the real Facebook profile URL when available
};

/* ===================== PRODUCT DATA ===================== */
/* To add a cake: copy a line below and edit name, price, description and image. */
const CAKES = [
  { id:"cake-vanilla", name:"Vanilla Cake", price:25000, description:"Soft, moist vanilla sponge with a light buttercream finish.", image:"https://loremflickr.com/500/380/vanillacake?lock=1" },
  { id:"cake-chocolate", name:"Chocolate Cake", price:28000, description:"Rich chocolate sponge layered with chocolate ganache.", image:"https://loremflickr.com/500/380/chocolatecake?lock=2" },
  { id:"cake-redvelvet", name:"Red Velvet Cake", price:32000, description:"Classic red velvet with smooth cream cheese frosting.", image:"https://loremflickr.com/500/380/redvelvetcake?lock=3" },
  { id:"cake-carrot", name:"Carrot Cake", price:27000, description:"Spiced carrot sponge topped with cream cheese icing.", image:"https://loremflickr.com/500/380/carrotcake?lock=4" },
  { id:"cake-fruit", name:"Fruit Cake", price:30000, description:"Dense, richly spiced fruit cake, a family celebration favourite.", image:"https://loremflickr.com/500/380/fruitcake?lock=5" },
  { id:"cake-birthday", name:"Birthday Cake", price:35000, description:"Custom-decorated birthday cake in your choice of theme and colours.", image:"https://loremflickr.com/500/380/birthdaycake?lock=6" },
  { id:"cake-wedding", name:"Wedding Cake", price:120000, description:"Elegant tiered wedding cake, designed around your event colours.", image:"https://loremflickr.com/500/380/weddingcake?lock=7" },
  { id:"cake-celebration", name:"Celebration Cake", price:38000, description:"A show-stopping cake for anniversaries and milestone events.", image:"https://loremflickr.com/500/380/celebrationcake?lock=8" },
  { id:"cake-cupcakes", name:"Cupcakes (Box of 12)", price:15000, description:"Assorted flavoured cupcakes, beautifully finished, sold by the dozen.", image:"https://loremflickr.com/500/380/cupcakes?lock=9" },
];

/* To add a snack: copy a line below and edit name, price, description and image. */
const SNACKS = [
  { id:"snack-meatpie", name:"Meat Pie (Pack of 10)", price:6000, description:"Flaky pastry filled with seasoned minced meat and vegetables.", image:"https://loremflickr.com/500/380/meatpie?lock=10" },
  { id:"snack-chickenpie", name:"Chicken Pie (Pack of 10)", price:7000, description:"Buttery pastry parcels filled with tender seasoned chicken.", image:"https://loremflickr.com/500/380/chickenpie?lock=11" },
  { id:"snack-sausageroll", name:"Sausage Roll (Pack of 10)", price:5000, description:"Golden puff pastry wrapped around savoury sausage filling.", image:"https://loremflickr.com/500/380/sausageroll?lock=12" },
  { id:"snack-doughnut", name:"Doughnut (Pack of 10)", price:4000, description:"Soft, fluffy doughnuts glazed to sweet perfection.", image:"https://loremflickr.com/500/380/doughnut?lock=13" },
  { id:"snack-puffpuff", name:"Puff Puff (Pack of 20)", price:3500, description:"Light, fluffy fried dough balls, a Nigerian party staple.", image:"https://loremflickr.com/500/380/puffpuff,friedsnack?lock=14" },
  { id:"snack-chinchin", name:"Chin Chin (500g)", price:3000, description:"Crunchy, lightly sweetened fried snack, perfect for any gathering.", image:"https://loremflickr.com/500/380/chinchin,friedsnack?lock=15" },
  { id:"snack-springroll", name:"Spring Roll (Pack of 10)", price:5500, description:"Crisp pastry rolls filled with seasoned vegetables and meat.", image:"https://loremflickr.com/500/380/springroll?lock=16" },
  { id:"snack-samosa", name:"Samosa (Pack of 10)", price:5000, description:"Spiced filling wrapped in crisp, golden pastry triangles.", image:"https://loremflickr.com/500/380/samosa?lock=17" },
];

/* Combined list used to populate the order form's product dropdown. */
const ALL_PRODUCTS = [
  ...CAKES, ...SNACKS,
  { id:"catering-enquiry", name:"General Catering Enquiry (custom quote)", price:0, description:"For full event catering — we'll follow up with a quote.", image:"" },
];

/* ===================== UTILS ===================== */
function formatPrice(n){ return "₦" + Number(n).toLocaleString("en-NG"); }
function findProduct(id){ return ALL_PRODUCTS.find(p => p.id === id); }
// Escapes text before it is placed via innerHTML — the only sanitizer this page needs,
// since every dynamic string rendered through innerHTML passes through this first.
function esc(str){ return String(str ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch])); }

/* ===================== RENDER PRODUCT GRIDS ===================== */
function renderProductGrid(hostId, products){
  const host = document.getElementById(hostId);
  host.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="500" height="380"></div>
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
        <button class="btn btn-primary" data-order="${p.id}">Order Now</button>
      </div>
    `;
    card.querySelector("[data-order]").addEventListener("click", () => openOrderModal(p.id));
    host.appendChild(card);
  });
}

/* ===================== ORDER MODAL ===================== */
function populateProductSelect(){
  const select = document.getElementById("productSelect");
  select.innerHTML = ALL_PRODUCTS.map(p => `<option value="${p.id}">${esc(p.name)} — ${formatPrice(p.price)}</option>`).join("");
}

function updateEstimatedTotal(){
  const productId = document.getElementById("productSelect").value;
  const qty = Math.max(1, Number(document.getElementById("qty").value) || 1);
  const product = findProduct(productId);
  const total = product ? product.price * qty : 0;
  document.getElementById("estimatedTotal").textContent = formatPrice(total);
  return total;
}

function openOrderModal(productId){
  document.getElementById("orderFormView").hidden = false;
  document.getElementById("orderSuccessView").hidden = true;
  document.getElementById("orderForm").reset();
  clearFormErrors();
  if(productId) document.getElementById("productSelect").value = productId;
  document.getElementById("qty").value = 1;
  updateEstimatedTotal();

  document.getElementById("modalOverlay").hidden = false;
  const modal = document.getElementById("orderModal");
  modal.hidden = false;
  requestAnimationFrame(() => {
    document.getElementById("modalOverlay").style.opacity = "1";
    modal.classList.add("open");
  });
  document.getElementById("custName").focus();
}

function closeOrderModal(){
  document.getElementById("modalOverlay").style.opacity = "0";
  document.getElementById("orderModal").classList.remove("open");
  setTimeout(() => {
    document.getElementById("modalOverlay").hidden = true;
    document.getElementById("orderModal").hidden = true;
  }, 200);
}

function clearFormErrors(){
  document.querySelectorAll(".form-field").forEach(f => f.classList.remove("invalid"));
  document.querySelectorAll(".form-error").forEach(e => e.textContent = "");
}

function validateOrderForm(){
  let valid = true;
  const rules = {
    custName: v => v.trim().length >= 2 || "Please enter your full name.",
    custPhone: v => /^[0-9+()\-\s]{7,15}$/.test(v.trim()) || "Please enter a valid phone number.",
    prefDate: v => v.trim().length > 0 || "Please choose a preferred date.",
  };
  Object.entries(rules).forEach(([field, check]) => {
    const input = document.getElementById(field);
    const wrap = input.closest(".form-field");
    const errEl = document.getElementById("err-" + field);
    const result = check(input.value);
    if(result === true){ wrap.classList.remove("invalid"); errEl.textContent = ""; }
    else{ wrap.classList.add("invalid"); errEl.textContent = result; valid = false; }
  });
  return valid;
}

function buildWhatsAppMessage(order){
  const lines = [
    `New order request — ${BUSINESS.name}`,
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Product: ${order.productName}`,
    `Quantity: ${order.qty}`,
    `Preferred date: ${order.date}`,
    `Estimated Total: ${formatPrice(order.total)}`,
  ];
  if(order.notes) lines.push(`Notes: ${order.notes}`);
  return lines.join("\n");
}

function handleOrderSubmit(e){
  e.preventDefault();
  if(!validateOrderForm()) return;

  const product = findProduct(document.getElementById("productSelect").value);
  const order = {
    name: document.getElementById("custName").value.trim(),
    phone: document.getElementById("custPhone").value.trim(),
    productName: product.name,
    qty: Math.max(1, Number(document.getElementById("qty").value) || 1),
    date: document.getElementById("prefDate").value,
    notes: document.getElementById("notes").value.trim(),
    total: updateEstimatedTotal(),
  };

  const waMessage = buildWhatsAppMessage(order);
  const waUrl = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  document.getElementById("successMessage").textContent =
    `Thank you, ${order.name}! We've received your request for ${order.productName} (x${order.qty}) for ${order.date}. Tap below to confirm the details on WhatsApp so we can get started.`;
  document.getElementById("waSendBtn").href = waUrl;

  document.getElementById("orderFormView").hidden = true;
  document.getElementById("orderSuccessView").hidden = false;

  // Open WhatsApp automatically as well, so the customer doesn't have to click twice.
  window.open(waUrl, "_blank", "noopener");
}

/* ===================== NAV ===================== */
function bindNav(){
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("navToggle");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ===================== INIT ===================== */
function init(){
  renderProductGrid("cakeGrid", CAKES);
  renderProductGrid("snackGrid", SNACKS);
  populateProductSelect();
  bindNav();

  document.getElementById("productSelect").addEventListener("change", updateEstimatedTotal);
  document.getElementById("qty").addEventListener("input", updateEstimatedTotal);
  document.getElementById("orderForm").addEventListener("submit", handleOrderSubmit);

  document.getElementById("closeModal").addEventListener("click", closeOrderModal);
  document.getElementById("modalOverlay").addEventListener("click", closeOrderModal);
  document.getElementById("closeSuccessBtn").addEventListener("click", closeOrderModal);
  document.addEventListener("keydown", (e) => { if(e.key === "Escape" && !document.getElementById("orderModal").hidden) closeOrderModal(); });

  document.getElementById("requestCateringBtn").addEventListener("click", () => openOrderModal("catering-enquiry"));

  const waLink = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent("Hi Doris Delight Ventures, I'd like to place an order.")}`;
  document.getElementById("whatsappContactBtn").href = waLink;
  document.getElementById("facebookLink").href = BUSINESS.facebookUrl;
}

document.addEventListener("DOMContentLoaded", init);
