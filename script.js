// FindMyMeds prototype script
// This project is a front-end demonstration and uses localStorage to remember saved medicines and profile details.

const STORAGE_KEYS = {
    savedMedicines: "findMyMedsSavedMedicines",
    profile: "findMyMedsProfile",
    currentSearch: "findMyMedsCurrentSearch",
    currentPharmacy: "findMyMedsCurrentPharmacy",
};

const demoPharmacies = [{
        id: "healthplus",
        name: "HealthPlus Pharmacy",
        location: "Kanifing",
        address: "Main Road, Kanifing, The Gambia",
        status: "Available",
        phone: "+220 555 0001",
        hours: "Mon - Sat: 8:00 AM - 8:00 PM",
        availabilityText: "Available",
    },
    {
        id: "care",
        name: "Care Pharmacy",
        location: "Serrekunda",
        address: "Bakau Road, Serrekunda, The Gambia",
        status: "Available",
        phone: "+220 555 0002",
        hours: "Mon - Sun: 9:00 AM - 9:00 PM",
        availabilityText: "Available",
    },
    {
        id: "medicare",
        name: "MediCare Pharmacy",
        location: "Brikama",
        address: "Bintang Road, Brikama, The Gambia",
        status: "Limited Stock",
        phone: "+220 555 0003",
        hours: "Mon - Sat: 8:30 AM - 7:30 PM",
        availabilityText: "Limited Stock",
    },
    {
        id: "city",
        name: "City Pharmacy",
        location: "Banjul",
        address: "Independence Drive, Banjul, The Gambia",
        status: "Unavailable",
        phone: "+220 555 0004",
        hours: "Mon - Fri: 8:00 AM - 6:00 PM",
        availabilityText: "Unavailable",
    },
];

const defaultProfile = {
    name: "Aisha Sarr",
    phone: "+220 555 1234",
};

function getSavedMedicines() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.savedMedicines)) || [];
    } catch (error) {
        return [];
    }
}

function setSavedMedicines(medicines) {
    localStorage.setItem(STORAGE_KEYS.savedMedicines, JSON.stringify(medicines));
}

function getProfile() {
    try {
        return (
            JSON.parse(localStorage.getItem(STORAGE_KEYS.profile)) || defaultProfile
        );
    } catch (error) {
        return defaultProfile;
    }
}

function setProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

function formatMedicineName(value) {
    const cleanValue = (value || "").trim();
    return cleanValue ? cleanValue.replace(/\s+/g, " ") : "Paracetamol";
}

function getStatusClass(status) {
    const normalized = String(status || "").toLowerCase();
    if (normalized.includes("limited")) return "limited";
    if (normalized.includes("unavailable")) return "unavailable";
    return "available";
}

function saveCurrentSearch(medicineName) {
    localStorage.setItem(STORAGE_KEYS.currentSearch, medicineName);
}

function saveCurrentPharmacy(pharmacy) {
    localStorage.setItem(STORAGE_KEYS.currentPharmacy, JSON.stringify(pharmacy));
}

function showStatusMessage(element, message, type = "info") {
    if (!element) return;
    element.textContent = message;
    element.style.color =
        type === "success" ? "#15965e" : type === "error" ? "#d44747" : "#1556a8";
}

function handleSearchSubmit(searchValue) {
    const medicineName = formatMedicineName(searchValue);
    saveCurrentSearch(medicineName);
    window.location.href = `search-results.html?medicine=${encodeURIComponent(medicineName)}`;
}

function initHomePage() {
    const searchForm = document.getElementById("medicine-search-form");
    const medicineInput = document.getElementById("medicine-search-input");

    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            handleSearchSubmit(medicineInput.value);
        });
    }

    document.querySelectorAll(".popular-pill").forEach((button) => {
        button.addEventListener("click", () => {
            handleSearchSubmit(button.dataset.medicine);
        });
    });
}

function initSearchResultsPage() {
    const searchTerm = document.getElementById("search-term");
    const resultsList = document.getElementById("results-list");
    const miniForm = document.getElementById("mini-search-form");
    const miniInput = document.getElementById("mini-search-input");

    const params = new URLSearchParams(window.location.search);
    const selectedMedicine = formatMedicineName(
        params.get("medicine") || localStorage.getItem(STORAGE_KEYS.currentSearch),
    );
    saveCurrentSearch(selectedMedicine);

    if (searchTerm) {
        searchTerm.textContent = selectedMedicine;
    }

    if (miniForm && miniInput) {
        miniForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const nextMedicine = formatMedicineName(miniInput.value);
            handleSearchSubmit(nextMedicine);
        });
    }

    if (!resultsList) return;

    const cards = demoPharmacies
        .map(
            (pharmacy) => `
        <article class="result-card">
          <div class="result-header">
            <div>
              <h3>${pharmacy.name}</h3>
            </div>
            <span class="status-pill ${getStatusClass(pharmacy.status)}">${pharmacy.status}</span>
          </div>

          <div class="result-meta">
            <span><strong>Location:</strong> ${pharmacy.location}</span>
            <span><strong>Availability:</strong> ${pharmacy.status}</span>
          </div>

          <button class="view-details-btn" type="button" data-id="${pharmacy.id}">
            View Details
          </button>
        </article>
      `,
        )
        .join("");

    resultsList.innerHTML = cards;

    resultsList.querySelectorAll(".view-details-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const selected = demoPharmacies.find(
                (pharmacy) => pharmacy.id === button.dataset.id,
            );
            if (!selected) return;

            saveCurrentPharmacy(selected);
            const medicineName = formatMedicineName(selectedMedicine);
            window.location.href = `pharmacy-details.html?medicine=${encodeURIComponent(medicineName)}`;
        });
    });
}

function initPharmacyDetailsPage() {
    const selectedPharmacy =
        JSON.parse(localStorage.getItem(STORAGE_KEYS.currentPharmacy) || "null") ||
        demoPharmacies[0];
    const params = new URLSearchParams(window.location.search);
    const medicineName = formatMedicineName(
        params.get("medicine") || localStorage.getItem(STORAGE_KEYS.currentSearch),
    );
    saveCurrentSearch(medicineName);

    const detailName = document.getElementById("detail-name");
    const detailLocation = document.getElementById("detail-location");
    const detailAddress = document.getElementById("detail-address");
    const detailMedicine = document.getElementById("detail-medicine");
    const detailAvailability = document.getElementById("detail-availability");
    const detailPhone = document.getElementById("detail-phone");
    const detailHours = document.getElementById("detail-hours");
    const detailStatus = document.getElementById("detail-status");
    const feedbackMessage = document.getElementById("feedback-message");
    const saveMedicineButton = document.getElementById("save-medicine-button");
    const callButton = document.getElementById("call-button");
    const directionsButton = document.getElementById("directions-button");

    if (detailName) detailName.textContent = selectedPharmacy.name;
    if (detailLocation) detailLocation.textContent = selectedPharmacy.location;
    if (detailAddress) detailAddress.textContent = selectedPharmacy.address;
    if (detailMedicine) detailMedicine.textContent = medicineName;
    if (detailAvailability)
        detailAvailability.textContent = selectedPharmacy.status;
    if (detailPhone) detailPhone.textContent = selectedPharmacy.phone;
    if (detailHours) detailHours.textContent = selectedPharmacy.hours;
    if (detailStatus) {
        detailStatus.textContent = selectedPharmacy.status;
        detailStatus.className = `status-badge ${getStatusClass(selectedPharmacy.status)}`;
    }

    if (saveMedicineButton) {
        const savedMedicines = getSavedMedicines();
        const alreadySaved = savedMedicines.some(
            (item) => item.name.toLowerCase() === medicineName.toLowerCase(),
        );

        if (alreadySaved) {
            saveMedicineButton.textContent = "Saved";
            saveMedicineButton.disabled = true;
            saveMedicineButton.style.opacity = "0.8";
        }

        saveMedicineButton.addEventListener("click", () => {
            const medicines = getSavedMedicines();
            const alreadyExists = medicines.some(
                (item) => item.name.toLowerCase() === medicineName.toLowerCase(),
            );

            if (!alreadyExists) {
                medicines.push({
                    id: Date.now(),
                    name: medicineName,
                    savedAt: new Date().toISOString(),
                });
                setSavedMedicines(medicines);
            }

            saveMedicineButton.textContent = "Saved";
            saveMedicineButton.disabled = true;
            saveMedicineButton.style.opacity = "0.8";
            showStatusMessage(
                feedbackMessage,
                `${medicineName} was saved to your medicines list.`,
                "success",
            );
        });
    }

    if (callButton) {
        callButton.addEventListener("click", () => {
            showStatusMessage(
                feedbackMessage,
                `Demo: Calling ${selectedPharmacy.name} at ${selectedPharmacy.phone}.`,
                "info",
            );
        });
    }

    if (directionsButton) {
        directionsButton.addEventListener("click", () => {
            showStatusMessage(
                feedbackMessage,
                `Demo: Getting directions to ${selectedPharmacy.name} in ${selectedPharmacy.location}.`,
                "info",
            );
        });
    }
}

function renderSavedMedicines() {
    const savedMedicineList = document.getElementById("saved-medicine-list");
    if (!savedMedicineList) return;

    const medicines = getSavedMedicines();

    if (!medicines.length) {
        savedMedicineList.innerHTML = `
      <div class="saved-item">
        <div>
          <strong>No saved medicines yet</strong>
          <div class="saved-meta">Search a medicine and save it from the details page.</div>
        </div>
      </div>
    `;
        return;
    }

    savedMedicineList.innerHTML = medicines
        .map(
            (item) => `
        <div class="saved-item">
          <div>
            <strong>${item.name}</strong>
            <div class="saved-meta">Saved for quick access</div>
          </div>
          <button class="remove-item-btn" type="button" data-name="${item.name}">Remove</button>
        </div>
      `,
        )
        .join("");

    savedMedicineList.querySelectorAll(".remove-item-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const nameToRemove = button.dataset.name;
            const updatedMedicines = getSavedMedicines().filter(
                (item) => item.name !== nameToRemove,
            );
            setSavedMedicines(updatedMedicines);
            renderSavedMedicines();
        });
    });
}

function initSavedProfilePage() {
    const profileForm = document.getElementById("profile-form");
    const nameInput = document.getElementById("user-name");
    const phoneInput = document.getElementById("user-phone");
    const editButton = document.getElementById("edit-profile-btn");
    const profileFeedback = document.getElementById("profile-feedback");

    const profile = getProfile();
    if (nameInput) nameInput.value = profile.name || defaultProfile.name;
    if (phoneInput) phoneInput.value = profile.phone || defaultProfile.phone;

    if (editButton) {
        editButton.addEventListener("click", () => {
            if (nameInput) nameInput.disabled = false;
            if (phoneInput) phoneInput.disabled = false;
            if (nameInput) nameInput.focus();
            showStatusMessage(
                profileFeedback,
                "Profile fields are now editable.",
                "info",
            );
        });
    }

    if (profileForm) {
        profileForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const updatedProfile = {
                name:
                    (nameInput ? nameInput.value : defaultProfile.name).trim() ||
                    defaultProfile.name,
                phone:
                    (phoneInput ? phoneInput.value : defaultProfile.phone).trim() ||
                    defaultProfile.phone,
            };

            setProfile(updatedProfile);

            if (nameInput) nameInput.disabled = true;
            if (phoneInput) phoneInput.disabled = true;
            showStatusMessage(
                profileFeedback,
                "Profile saved successfully.",
                "success",
            );
        });
    }

    renderSavedMedicines();
}

document.addEventListener("DOMContentLoaded", () => {
    const pageName = document.body.dataset.page;

    if (pageName === "home") {
        initHomePage();
    }

    if (pageName === "search-results") {
        initSearchResultsPage();
    }

    if (pageName === "pharmacy-details") {
        initPharmacyDetailsPage();
    }

    if (pageName === "saved-profile") {
        initSavedProfilePage();
    }
});