import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../assets/styles/ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);

  // Talles disponibles
  const tallesDisponibles = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

  useEffect(() => {
    const productosMock = [
      // Página 1 - 8 productos
      { id_producto: 1, nombre: "Nike Air Max 270", marca: "Nike", precio: 25000, url_imagen: "https://m.media-amazon.com/images/I/61TpwR4jLIL.jpg", descripcion: "Zapatillas deportivas con tecnología Air Max para máxima comodidad y estilo. Perfectas para uso diario y actividades deportivas." },
      { id_producto: 2, nombre: "Adidas Ultraboost", marca: "Adidas", precio: 28000, url_imagen: "https://m.media-amazon.com/images/I/51UQ1rYgFFL._AC_SL1000_.jpg", descripcion: "Zapatillas de running con tecnología Boost para máximo retorno de energía. Ideales para largas distancias y alto rendimiento." },
      { id_producto: 3, nombre: "Puma RS-X", marca: "Puma", precio: 18000, url_imagen: "https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw0898e6b4/products/PU_371008-14/PU_371008-14-1.JPG", descripcion: "Diseño urbano y moderno con amortiguación Running System. Perfectas para el día a día con un estilo retro-futurista." },
      { id_producto: 4, nombre: "Reebok Classic", marca: "Reebok", precio: 15000, url_imagen: "https://reebok.com.ar/cdn/shop/files/RBK1100008492-1.jpg?v=1756497801", descripcion: "Zapatillas clásicas con estilo atemporal. Comodidad garantizada para uso casual y versatilidad en cualquier ocasión." },
      { id_producto: 5, nombre: "New Balance 574", marca: "New Balance", precio: 22000, url_imagen: "https://www.newbalance.com.ar/on/demandware.static/-/Sites-siteCatalog_NBEU/default/dw6eaffbdb/new_images/N1T000089408/N1T000089408-IMAGE-1.webp", descripcion: "Modelo icónico con suela ENCAP para soporte y durabilidad. Combina estilo retro con tecnología moderna." },
      { id_producto: 6, nombre: "Converse Chuck Taylor", marca: "Converse", precio: 12000, url_imagen: "https://www.stockcenter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw30726460/products/CO_568497C/CO_568497C-1.JPG", descripcion: "Las zapatillas más icónicas de todos los tiempos. Estilo casual y versátil para cualquier outfit." },
      { id_producto: 7, nombre: "Vans Old Skool", marca: "Vans", precio: 14000, url_imagen: "https://cdn-images.farfetch-contents.com/25/25/55/72/25255572_55353963_600.jpg", descripcion: "Zapatillas skate con la clásica banda lateral. Suela Waffle para máximo agarre y durabilidad." },
      { id_producto: 8, nombre: "Fila Disruptor", marca: "Fila", precio: 16000, url_imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuRYzXS03FslmajpRjCz6kyGY4b0iGpWczXA&s", descripcion: "Diseño chunky de los 90's con plataforma elevada. Estilo urbano audaz y máxima comodidad." },
      
      // Página 2 - 8 productos
      { id_producto: 9, nombre: "Asics Gel-Kayano", marca: "Asics", precio: 26000, url_imagen: "https://asicsar.vtexassets.com/arquivos/ids/162809/asics_1203A537103_103_00.jpg?v=638787701984070000", descripcion: "Zapatillas de running con tecnología GEL para máxima amortiguación. Ideal para corredores que buscan estabilidad." },
      { id_producto: 10, nombre: "Skechers D'Lites", marca: "Skechers", precio: 13000, url_imagen: "https://celadasa.vtexassets.com/arquivos/ids/379627-800-auto?v=638627146931530000&width=800&height=auto&aspect=true", descripcion: "Zapatillas con suela de espuma viscoelástica Memory Foam. Comodidad extrema para todo el día." },
      { id_producto: 11, nombre: "Under Armour HOVR", marca: "Under Armour", precio: 24000, url_imagen: "https://underarmour.scene7.com/is/image/Underarmour/3024444-001_DEFAULT", descripcion: "Tecnología HOVR para sensación de cero gravedad. Perfectas para entrenamientos intensos y running." },
      { id_producto: 12, nombre: "Salomon Speedcross", marca: "Salomon", precio: 27000, url_imagen: "https://salomonstore.com.ar/cdn/shop/files/L47567900__1.jpg?v=1759257967&width=2048", descripcion: "Zapatillas de trail running con agarre agresivo. Diseñadas para terrenos técnicos y condiciones extremas." },
      { id_producto: 13, nombre: "Brooks Ghost", marca: "Brooks", precio: 23000, url_imagen: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw005c0e9a/products/BRCRNMLIV0028AZNGVE/BRCRNMLIV0028AZNGVE-1.JPG", descripcion: "Zapatillas de running neutras con amortiguación suave. Balance perfecto entre comodidad y respuesta." },
      { id_producto: 14, nombre: "Hoka One One Clifton", marca: "Hoka", precio: 29000, url_imagen: "https://www.sumitate.com.ar/img/articulos/2024/12/imagen1_zapatillas_de_running_hoka_clifton_9_mujer_imagen1.webp", descripcion: "Máxima amortiguación con peso ultraligero. Experiencia de carrera suave y eficiente." },
      { id_producto: 15, nombre: "Mizuno Wave Rider", marca: "Mizuno", precio: 21000, url_imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvlC9K4ncyIwTD9hkNQSRKK9Sy2l7bGUlhgQ&s", descripcion: "Tecnología Wave para estabilidad y amortiguación. Ideales para corredores de distancias largas." },
      { id_producto: 16, nombre: "Nike React Infinity", marca: "Nike", precio: 26500, url_imagen: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dwc23a352d/products/NI_CD4371-002/NI_CD4371-002-1.JPG", descripcion: "Diseñadas para reducir lesiones con soporte óptimo. Espuma React para máxima respuesta y durabilidad." },
      
      // Página 3 - 8 productos
      { id_producto: 17, nombre: "Adidas NMD R1", marca: "Adidas", precio: 19000, url_imagen: "https://production.cdn.vaypol.com/variants/ww07tfed1uypiq9dn0t1yj8blmp0/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4", descripcion: "Estilo urbano con tecnología Boost. Diseño minimalista y moderno para el día a día." },
      { id_producto: 18, nombre: "Puma Suede Classic", marca: "Puma", precio: 17000, url_imagen: "https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw40e99466/products/PU399936-07/PU399936-07-1.JPG", descripcion: "Icono del streetwear desde los 60's. Ante premium y estilo atemporal que nunca pasa de moda." },
      { id_producto: 19, nombre: "Reebok Nano X", marca: "Reebok", precio: 20000, url_imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxA59PJrQAWfR8KDN-mj8De7cZHN4_fds3zA&s", descripcion: "Diseñadas para CrossFit y entrenamientos funcionales. Estabilidad y flexibilidad en una sola zapatilla." },
      { id_producto: 20, nombre: "New Balance Fresh Foam", marca: "New Balance", precio: 23500, url_imagen: "https://www.newbalance.com.ar/on/demandware.static/-/Sites-siteCatalog_NBEU/default/dw6c0a129a/new_images/N1T000060600/N1T000060600-IMAGE-1.webp", descripcion: "Amortiguación Fresh Foam para pisada suave. Comodidad premium para running y uso diario." },
      { id_producto: 21, nombre: "Converse Pro Leather", marca: "Converse", precio: 14500, url_imagen: "https://www.converse.com/dw/image/v2/BJJF_PRD/on/demandware.static/-/Sites-cnv-master-catalog-we/default/dw2b520d65/images/a_08/170649C_A_08X1.jpg?sw=406&strip=false", descripcion: "Estilo retro basketball con cuero premium. Clásico renovado con máxima versatilidad." },
      { id_producto: 22, nombre: "Vans Sk8-Hi", marca: "Vans", precio: 15500, url_imagen: "https://chelseaio.vtexassets.com/arquivos/ids/616281/VN000D5IB8C1_1.jpg?v=638951114167100000", descripcion: "Botín clásico de skate con soporte de tobillo. Icónico diseño con suela Waffle para máximo grip." },
      { id_producto: 23, nombre: "Fila Ray Tracer", marca: "Fila", precio: 18500, url_imagen: "https://filaar.vtexassets.com/arquivos/ids/6878390/fila_F01L095_970_00.jpg?v=638582004159170000", descripcion: "Diseño dad shoe con estilo audaz. Combinación perfecta de comodidad y tendencia retro." },
      { id_producto: 24, nombre: "Asics Gel-Nimbus", marca: "Asics", precio: 28500, url_imagen: "https://production.cdn.vaypol.com/variants/6e0blrhz11wk6puwhetrpb6x0fzq/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4", descripcion: "Máxima amortiguación para largas distancias. Tecnología GEL y FlyteFoam para confort superior." },
    ];

    const productoEncontrado = productosMock.find(p => p.id_producto === parseInt(id));
    setProducto(productoEncontrado);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <p>Cargando producto...</p>
        </div>
      </MainLayout>
    );
  }

  if (!producto) {
    return (
      <MainLayout>
        <div className="error-container">
          <p>Producto no encontrado</p>
          <button onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="product-detail-page">
        <div className="product-detail-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Volver
          </button>

          <div className="product-detail-content">
            <div className="product-detail-image">
              <img src={producto.url_imagen} alt={producto.nombre} />
            </div>

            <div className="product-detail-info">
              <p className="product-detail-brand">{producto.marca}</p>
              <h1 className="product-detail-title">{producto.nombre}</h1>

              <p className="product-detail-price">
                ${producto.precio.toLocaleString('es-AR')}
              </p>

              <p className="product-detail-description">
                {producto.descripcion}
              </p>

              <div className="size-selector">
                <h3 className="size-selector-title">Selecciona tu talle</h3>
                <div className="size-grid">
                  {tallesDisponibles.map((talle) => (
                    <button
                      key={talle}
                      className={`size-button ${talleSeleccionado === talle ? 'selected' : ''}`}
                      onClick={() => setTalleSeleccionado(talle)}
                    >
                      {talle}
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-actions">
                <button 
                  className="add-to-cart-btn"
                  disabled={!talleSeleccionado}
                >
                  {talleSeleccionado ? 'Agregar al carrito' : 'Selecciona un talle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;