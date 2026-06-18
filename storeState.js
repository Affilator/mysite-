/**
 * 🌐 FAIZI STORE HUB - Global State Management (Enterprise Version)
 * د نړۍ په کچه د سټور د معلوماتو، کارټ، او کاروونکو مسلکي اداره کوونکی
 */
class GlobalStore {
    #state; // د پردې تر شا پټه مېموري (Private State) ترڅو هکران ورته لاسرسی ونلري
    #listeners; // د پاڼې د بېلابېلو برخو د خبرولو لېست

    constructor() {
        this.#state = {
            cart: [],
            currentUser: null,
            activeVendor: null,
            affiliateId: null,
            currency: 'USD'
        };
        this.#listeners = [];
    }

    // ۱. د سټېټ د معلوماتو د لوستلو خوندي لاره (Getter)
    getState() {
        return JSON.parse(JSON.stringify(this.#state)); // Deep copy ترڅو اصلي ډېټا په براوزر کې خراب نشي
    }

    // ۲. په کارټ کې د محصول اضافه کول او د سټاک کنټرول
    addToCart(product) {
        // د آمازون غوندې سېسټم: که محصول وار د مخه و، یوازې تعداد یې زیات کړه
        const existingItem = this.#state.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.#state.cart.push({ ...product, quantity: 1 });
        }
        
        console.log(`🛒 محصول [${product.name}] په کارټ کې په نړیواله کچه ثبت شو.`);
        this.#notifyListeners('cart_updated');
    }

    // ۳. د کاروونکي یا افیلیټ کونکي ننوتل (Authentication State)
    setUser(user) {
        this.#state.currentUser = user;
        if (user?.affiliateId) {
            this.#state.affiliateId = user.affiliateId;
        }
        this.#notifyListeners('user_session_changed');
    }

    // ۴. د پاڼې د برخو د خبرولو مېتود (Subscribe)
    subscribe(callback) {
        this.#listeners.push(callback);
        return () => {
            this.#listeners = this.#listeners.filter(listener => listener !== callback);
        };
    }

    // ۵. ټولو برخو ته د نوي تغیرات لېږل (Publish)
    #notifyListeners(event) {
        this.#listeners.forEach(callback => callback(event, this.getState()));
    }
}

// د نړۍ په کچه د سټور د مغز فعالول او بندول
window.FaiziStore = new GlobalStore();
Object.freeze(window.FaiziStore); // د سېسټم د کوډونو قانوني بندول ترڅو په براوزر کې څوک بدلون پکې رانه وستلی شي
