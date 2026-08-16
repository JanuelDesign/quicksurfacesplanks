# Guía de Nombres y Organización de Imágenes en GitHub

Puedes subir todas las imágenes de los pisos, renders 3D y trabajos realizados directamente a la carpeta `/public/images/` en tu repositorio de GitHub. 

Cada vez que hagas cambios o agregues imágenes con estos nombres, se mantendrán permanentemente en el repositorio sin borrarse.

---

### 1. Estructura de Carpetas Recomendada en `/public/`

```text
public/
  └── images/
      ├── floors/           (Fotos del tablón individual / plank)
      ├── rooms/            (Renders 3D o fotos de habitaciones amuebladas)
      ├── floorplans/       (Planos 2D arquitectónicos de cada modelo)
      └── gallery/          (Fotos reales de antes y después / escaleras)
```

---

### 2. Nomenclatura para Pisos (`/public/images/floors/`)
Usa el identificador de cada color en minúsculas separado por guiones:

* `moody-gray-01.jpg` (o `.png` / `.webp`)
* `fearless-gray-02.jpg`
* `trustable-oak-03.jpg`
* `grateful-pine-04.jpg`
* `vital-oak-05.jpg`
* `golden-honey-02.jpg`
* `japandi-beige-36.jpg`
* `liv-oak-31.jpg`
* `kirsche-oak-32.jpg`
* `taupe-oak-310.jpg`
* `chic-dark-38.jpg`
* `silver-oak-39.jpg`

---

### 3. Nomenclatura para Renders de Habitación (`/public/images/rooms/`)
* `room-trustable-oak.jpg`
* `room-japandi-beige.jpg`
* `room-liv-oak.jpg`
* `room-chic-dark.jpg`
* `room-golden-honey.jpg`

---

### 4. Nomenclatura para Modelos / Planos (`/public/images/floorplans/`)
* `model-bordeaux.jpg`
* `model-toledo.jpg`
* `model-oviedo.jpg`
* `model-lucena.jpg`
* `model-casis.jpg`
* `model-water-lilly.jpg`
* `model-blaze.jpg`
* `model-vivant.jpg`
* `model-caspian.jpg`

---

### 5. Cómo referenciarlas en la App o Google Sheets
Simplemente coloca la ruta relativa:
`/images/floors/trustable-oak-03.jpg` o la URL completa de tu GitHub / CDN.
