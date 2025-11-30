import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
//import { productsService } from '../../services/api.service';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;

  useEffect(() => {
    const productosMock = [
  // Página 1 - 8 productos
  { id_producto: 1, nombre: "Nike Air Max 270", marca: "Nike", precio: 25000, url_imagen: "https://m.media-amazon.com/images/I/61TpwR4jLIL.jpg" },
  { id_producto: 2, nombre: "Adidas Ultraboost", marca: "Adidas", precio: 28000, url_imagen: "https://m.media-amazon.com/images/I/51UQ1rYgFFL._AC_SL1000_.jpg" },
  { id_producto: 3, nombre: "Puma RS-X", marca: "Puma", precio: 18000, url_imagen: "https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw0898e6b4/products/PU_371008-14/PU_371008-14-1.JPG" },
  { id_producto: 4, nombre: "Reebok Classic", marca: "Reebok", precio: 15000, url_imagen: "https://reebok.com.ar/cdn/shop/files/RBK1100008492-1.jpg?v=1756497801" },
  { id_producto: 5, nombre: "New Balance 574", marca: "New Balance", precio: 22000, url_imagen: "https://www.newbalance.com.ar/on/demandware.static/-/Sites-siteCatalog_NBEU/default/dw6eaffbdb/new_images/N1T000089408/N1T000089408-IMAGE-1.webp" },
  { id_producto: 6, nombre: "Converse Chuck Taylor", marca: "Converse", precio: 12000, url_imagen: "https://www.stockcenter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw30726460/products/CO_568497C/CO_568497C-1.JPG" },
  { id_producto: 7, nombre: "Vans Old Skool", marca: "Vans", precio: 14000, url_imagen: "https://cdn-images.farfetch-contents.com/25/25/55/72/25255572_55353963_600.jpg" },
  { id_producto: 8, nombre: "Fila Disruptor", marca: "Fila", precio: 16000, url_imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuRYzXS03FslmajpRjCz6kyGY4b0iGpWczXA&s" },
  
  // Página 2 - 8 productos
  { id_producto: 9, nombre: "Asics Gel-Kayano", marca: "Asics", precio: 26000, url_imagen: "https://asicsar.vtexassets.com/arquivos/ids/162809/asics_1203A537103_103_00.jpg?v=638787701984070000" },
  { id_producto: 10, nombre: "Skechers D'Lites", marca: "Skechers", precio: 13000, url_imagen: "https://celadasa.vtexassets.com/arquivos/ids/379627-800-auto?v=638627146931530000&width=800&height=auto&aspect=true" },
  { id_producto: 11, nombre: "Under Armour HOVR", marca: "Under Armour", precio: 24000, url_imagen: "https://underarmour.scene7.com/is/image/Underarmour/3024444-001_DEFAULT" },
  { id_producto: 12, nombre: "Salomon Speedcross", marca: "Salomon", precio: 27000, url_imagen: "https://salomonstore.com.ar/cdn/shop/files/L47567900__1.jpg?v=1759257967&width=2048" },
  { id_producto: 13, nombre: "Brooks Ghost", marca: "Brooks", precio: 23000, url_imagen: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw005c0e9a/products/BRCRNMLIV0028AZNGVE/BRCRNMLIV0028AZNGVE-1.JPG" },
  { id_producto: 14, nombre: "Hoka One One Clifton", marca: "Hoka", precio: 29000, url_imagen: "https://www.sumitate.com.ar/img/articulos/2024/12/imagen1_zapatillas_de_running_hoka_clifton_9_mujer_imagen1.webp" },
  { id_producto: 15, nombre: "Mizuno Wave Rider", marca: "Mizuno", precio: 21000, url_imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvlC9K4ncyIwTD9hkNQSRKK9Sy2l7bGUlhgQ&s" },
  { id_producto: 16, nombre: "Nike React Infinity", marca: "Nike", precio: 26500, url_imagen: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dwc23a352d/products/NI_CD4371-002/NI_CD4371-002-1.JPG" },
  
  // Página 3 - 8 productos
  { id_producto: 17, nombre: "Adidas NMD R1", marca: "Adidas", precio: 19000, url_imagen: "https://production.cdn.vaypol.com/variants/ww07tfed1uypiq9dn0t1yj8blmp0/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4" },
  { id_producto: 18, nombre: "Puma Suede Classic", marca: "Puma", precio: 17000, url_imagen: "https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw40e99466/products/PU399936-07/PU399936-07-1.JPG" },
  { id_producto: 19, nombre: "Reebok Nano X", marca: "Reebok", precio: 20000, url_imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxA59PJrQAWfR8KDN-mj8De7cZHN4_fds3zA&s" },
  { id_producto: 20, nombre: "New Balance Fresh Foam", marca: "New Balance", precio: 23500, url_imagen: "https://www.newbalance.com.ar/on/demandware.static/-/Sites-siteCatalog_NBEU/default/dw6c0a129a/new_images/N1T000060600/N1T000060600-IMAGE-1.webp" },
  { id_producto: 21, nombre: "Converse Pro Leather", marca: "Converse", precio: 14500, url_imagen: "https://www.converse.com/dw/image/v2/BJJF_PRD/on/demandware.static/-/Sites-cnv-master-catalog-we/default/dw2b520d65/images/a_08/170649C_A_08X1.jpg?sw=406&strip=false" },
  { id_producto: 22, nombre: "Vans Sk8-Hi", marca: "Vans", precio: 15500, url_imagen: "https://chelseaio.vtexassets.com/arquivos/ids/616281/VN000D5IB8C1_1.jpg?v=638951114167100000" },
  { id_producto: 23, nombre: "Fila Ray Tracer", marca: "Fila", precio: 18500, url_imagen: "https://filaar.vtexassets.com/arquivos/ids/6878390/fila_F01L095_970_00.jpg?v=638582004159170000" },
  { id_producto: 24, nombre: "Asics Gel-Nimbus", marca: "Asics", precio: 28500, url_imagen: "https://production.cdn.vaypol.com/variants/6e0blrhz11wk6puwhetrpb6x0fzq/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4" },
];

    setTimeout(() => {
      setProductos(productosMock);
      setLoading(false);
    }, 500);
  }, []);

  // Calcular productos a mostrar
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosActuales = productos.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  const cambiarPagina = (numero) => {
    setPaginaActual(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="home-page">
        <div className="hero-banner">
          <div className="hero-content">
            <div className="hero-text-center">
              <h1 className="hero-title">
                Encuentra el Calzado Perfecto
              </h1>
              <p className="hero-subtitle">
                Las mejores marcas al mejor precio
              </p>
              <button className="hero-button">
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="content-layout">
            <aside className="sidebar">
              <FilterSidebar />
            </aside>

            <div className="products-section">
              <div className="products-header">
                <h2 className="products-title">
                  Productos 
                  <span className="products-count">({productos.length})</span>
                </h2>
                <select className="sort-select">
                  <option>Menor Precio</option>
                  <option>Mayor Precio</option>
                </select>
              </div>

              <div className="products-grid">
                {productosActuales.map((producto) => (
                  <ProductCard key={producto.id_producto} producto={producto} />
                ))}
              </div>

              <div className="pagination">
                <nav className="pagination-nav">
                  <button 
                    className="pagination-button"
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                  >
                    Anterior
                  </button>
                  {[...Array(totalPaginas)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-button ${paginaActual === index + 1 ? 'active' : ''}`}
                      onClick={() => cambiarPagina(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button 
                    className="pagination-button"
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;