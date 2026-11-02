// Notlar tarayıcının localStorage'ında saklanır, sayfa yenilense de kaybolmaz.
let notlar = JSON.parse(localStorage.getItem("notlar") || "[]");

const form = document.getElementById("not-formu");
const metinKutusu = document.getElementById("not-metni");
const zamanKutusu = document.getElementById("not-zamani");
const liste = document.getElementById("not-listesi");

function kaydet() {
  localStorage.setItem("notlar", JSON.stringify(notlar));
}

// Listeyi baştan çizer: her değişiklikten sonra çağrılır.
function goster() {
  liste.innerHTML = "";
  notlar.forEach((not, sira) => {
    const li = document.createElement("li");
    if (not.uyarildi) li.classList.add("gecti");

    const yazi = document.createElement("span");
    yazi.textContent = not.metin; // textContent, kullanıcı yazısını HTML olarak çalıştırmaz
    if (not.zaman) {
      const z = document.createElement("div");
      z.className = "zaman";
      z.textContent = "⏰ " + new Date(not.zaman).toLocaleString("tr-TR");
      yazi.appendChild(z);
    }

    const sil = document.createElement("button");
    sil.textContent = "Sil";
    sil.onclick = () => {
      notlar.splice(sira, 1);
      kaydet();
      goster();
    };

    li.append(yazi, sil);
    liste.appendChild(li);
  });
}

form.addEventListener("submit", (olay) => {
  olay.preventDefault(); // formun sayfayı yenilemesini engeller
  notlar.push({ metin: metinKutusu.value, zaman: zamanKutusu.value, uyarildi: false });
  kaydet();
  goster();
  form.reset();
});

// Her 10 saniyede bir zamanı gelen notları kontrol et.
// shortcut: sadece sayfa açıkken uyarır; kapalıyken uyarı için Notification + service worker gerekir.
setInterval(() => {
  const simdi = Date.now();
  notlar.forEach((not) => {
    if (not.zaman && !not.uyarildi && new Date(not.zaman).getTime() <= simdi) {
      not.uyarildi = true;
      kaydet();
      goster();
      alert("Hatırlatma: " + not.metin);
    }
  });
}, 10000);

// Karanlık mod: body'ye "karanlik" sınıfını ekleyip çıkarır, seçimi hatırlar.
const temaDugmesi = document.getElementById("tema-dugmesi");

function temaUygula(karanlik) {
  document.body.classList.toggle("karanlik", karanlik);
  temaDugmesi.textContent = karanlik ? "☀️" : "🌙";
}

temaDugmesi.onclick = () => {
  const karanlik = !document.body.classList.contains("karanlik");
  localStorage.setItem("karanlik", karanlik);
  temaUygula(karanlik);
};

temaUygula(localStorage.getItem("karanlik") === "true");
goster();
