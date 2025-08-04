const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute(
    "class",
    isOpen ? "ri-close-line" : "ri-menu-3-line"
  );
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".choose__image img", {
  ...scrollRevealOption,
  origin: "right",
  interval: 500,
});
ScrollReveal().reveal(".reveal-img.delay1", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".reveal-img.delay2", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".reveal-img.delay3", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".reveal-img.delay4", {
  ...scrollRevealOption,
  origin: "left",
});

// Inisialisasi Peta
const map = L.map('map').setView([-7.878, 110.451], 9);

const baseMaps = {
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map),
  "Satellite": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  })
  
};

L.control.layers(baseMaps).addTo(map);


const locations = [
  {
    name: "Posko KKN",
    lat: -7.962083,
    lng: 110.665417,
    img: "aset/posko 6.jpg"
  },
  {
    name: "Jembatan Plunyon",
    lat: -7.587792,
    lng: 110.443278,
    img: "aset/plunyon 1.jpg"
  },
  {
    name: "Batu Kapal",
    lat: -7.835139,
    lng: 110.445472,
    img: "aset/B kapal.jpg"
  },
  {
    name: "Joglo Wanagama",
    lat: -7.971065,
    lng: 110.648931,
    img: "aset/Joglo depan.JPG"
  }
];

let control;
function routeTo(lat, lng) {
  if (control) map.removeControl(control);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
      control = L.Routing.control({
        waypoints: [userLatLng, L.latLng(lat, lng)],
        routeWhileDragging: false
      }).addTo(map);
    }, () => {
      alert("Gagal mengakses lokasi. Aktifkan izin lokasi.");
    });
  } else {
    alert("Browser tidak mendukung geolokasi.");
  }
}

locations.forEach(loc => {
  const marker = L.marker([loc.lat, loc.lng]).addTo(map);

  const popupContent = `
    <div style="text-align:center; max-width: 200px;">
      <b style="font-size: 1.1rem;">${loc.name}</b><br>
      <img src="${loc.img}" alt="${loc.name}" style="width:100%; border-radius: 0.5rem; margin: 0.5rem 0;" />
<button style="..." onclick="navigateWithGoogle(${loc.lat}, ${loc.lng})">Navigasi</button>
    </div>
  `;
  marker.bindPopup(popupContent);

  marker.on('click', () => {
    map.flyTo([loc.lat, loc.lng], 15, { duration: 1.5 });
  });
});

// Tombol find my location
const locateBtn = L.control({ position: 'topleft' });
locateBtn.onAdd = function () {
  const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  div.innerHTML = '<button title="Temukan Lokasiku">📍</button>';
  div.onclick = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        L.marker(userLatLng).addTo(map).bindPopup('Lokasi Anda').openPopup();
        map.flyTo(userLatLng, 15, { duration: 1.5 });
      }, () => {
        alert("Tidak dapat menemukan lokasi Anda.");
      });
    }
  };
  return div;
};
locateBtn.addTo(map);

function navigateWithGoogle(lat, lng) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&travelmode=driving`;
      window.open(url, '_blank');
    }, () => {
      alert("Tidak dapat mengambil lokasi Anda.");
    });
  } else {
    alert("Browser tidak mendukung geolokasi.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const animElements = document.querySelectorAll(
    ".anim-slide-up, .anim-fade-in, .anim-zoom-in, .anim-slide-left"
  );

  const observerOptions = {
    threshold: 0.2, 
    rootMargin: '0px 0px -50px 0px' 
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        } else {
          entry.target.classList.remove("animate");
        }
      });
    },
    observerOptions
  );

  animElements.forEach((el) => observer.observe(el));
});


window.addEventListener('scroll', function() {
  const backToTop = document.querySelector('.back-to-top');
  if (window.pageYOffset > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value;
  if (email) {
    if (isValidEmail(email)) {
      alert('Terima kasih! Anda berhasil berlangganan newsletter CineMaps.');
      document.getElementById('newsletterEmail').value = '';
    } else {
      alert('Masukkan alamat email yang valid.');
    }
  } else {
    alert('Silakan masukkan alamat email Anda.');
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

document.addEventListener('DOMContentLoaded', function() {
  const newsletterInput = document.getElementById('newsletterEmail');
  if (newsletterInput) {
    newsletterInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        subscribeNewsletter();
      }
    });
  }
});

// Smooth scroll footer navigation links
document.querySelectorAll('.footer-section a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// sensitivitas animasi
function setAnimationSensitivity(threshold = 0.2, rootMargin = '0px 0px -50px 0px') {
  const animElements = document.querySelectorAll(
    ".anim-slide-up, .anim-fade-in, .anim-zoom-in, .anim-slide-left"
  );
  

  const newObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        } else {
          entry.target.classList.remove("animate");
        }
      });
    },
    {
      threshold: threshold,
      rootMargin: rootMargin
    }
  );

  animElements.forEach((el) => newObserver.observe(el));
}
