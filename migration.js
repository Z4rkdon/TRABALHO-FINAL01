const db = require("./db")

const ESTRUTURA_CLIENTE = `
DROP TABLE IF EXISTS cliente;
CREATE TABLE cliente (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(50) NOT NULL,
    cpf char(14) NOT NULL,
    email varchar(50) NOT NULL,
    celular char(14) NOT NULL,
    senha varchar(512) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY cpf (cpf),
    UNIQUE KEY email (email)
  ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
  `
const DADOS_CLIENTE = `
        INSERT INTO cliente VALUES
          (13,'Shigeo Kageyama','000.100.100-00','shigeo.mob@saltmiddle.edu.jp','11910001000','$2b$10$nwAtfeTMVQLaTXScFonsZOXyK5kgzG6LFT29EpaV/g1dg8lFiBXp.'),
          (14,'Guilherme Luiz','148.211.069-39','G@seila.com','(42)99931-8655','$2b$10$I0/r3J2d2xjydtam3xOVSe/sZWktY8S59wVlHhqwD0gdfTLosU0Ni');
        `

const ESTRUTURA_PRODUTO = `
DROP TABLE IF EXISTS produto;
CREATE TABLE produto (
    id int(11) NOT NULL AUTO_INCREMENT,
    nome varchar(200) NOT NULL,
    descricao text NOT NULL,
    categoria varchar(50) NOT NULL,
    preco decimal(10,2) NOT NULL,
    caminho_img varchar(50) NOT NULL,
    quantidade_img int(11) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`

const DADOS_PRODUTO = `
INSERT INTO produto VALUES 
(1,'Controle Xbox Series X|S Carbon Black','Controle sem fio oficial com textura antiderrapante, gatilhos responsivos e compatível com PC.','Controles',449.90,'http://localhost:3000/img/1.webp',4),
(2,'Controle DualSense PS5 Midnight Black','Controle oficial PlayStation 5 com feedback háptico, gatilhos adaptativos e microfone integrado.','Controles',499.00,'http://localhost:3000/img/5.jpg',3),
(3,'Controle Nintendo Switch Pro','Controle premium com analogicos de alta precisão, vibração HD e até 40h de bateria.','Controles',389.90,'http://localhost:3000/img/9.jpg',5),
(4,'Controle 8BitDo Ultimate 2.4G','Controle multiplataforma com dock de carregamento, hall effect sticks e suporte a PC/Switch/Android.','Controles',349.00,'http://localhost:3000/img/13.webp',3),
(5,'Controle Scuf Instinct Pro','Controle elite com botões traseiros remapeáveis, sticks intercambiáveis e acabamento premium.','Controles',1299.00,'http://localhost:3000/img/16.jpeg',2),
(6,'Headset Gamer HyperX Cloud II','Headset com som surround virtual 7.1, drivers de 53mm e microfone removível com cancelamento de ruído.','Áudio',499.90,'http://localhost:3000/img/19.jpeg',4),
(7,'Headset Razer BlackShark V2 Pro','Headset sem fio com drivers TriForce de 50mm, microfone HyperClear e até 70h de bateria.','Áudio',1299.00,'http://localhost:3000/img/23.webp',2),
(8,'Headset SteelSeries Arctis Nova Pro','Headset high-end com ANC, base station, som Hi-Res e microfone retrátil de alta clareza.','Áudio',1899.00,'http://localhost:3000/img/24.jpeg',1),
(9,'Headset Logitech G Pro X 2 Lightspeed','Headset sem fio profissional com drivers de grafeno, microfone Blue VO!CE e até 50h de bateria.','Áudio',1199.00,'http://localhost:3000/img/25.jpg',3),
(10,'Mouse Gamer Logitech G Pro X Superlight 2','Mouse ultraleve (60g) com sensor HERO 2 de 32K DPI e switches ópticos Lightforce.','Periféricos',899.00,'http://localhost:3000/img/27.jpg',4),
(11,'Mouse Razer Viper V3 Pro','Mouse esports de 54g com sensor Focus Pro 30K, switches ópticos e conexão HyperSpeed.','Periféricos',999.00,'http://localhost:3000/img/28.webp',3),
(12,'Mousepad Logitech G640 Cloth','Mousepad de pano grande (460x400mm) com superfície controlada ideal para jogos competitivos.','Periféricos',189.90,'http://localhost:3000/img/29.jpg',5),
(13,'Teclado Mecânico Keychron Q1 Pro','Teclado 75% wireless com switches Gateron, case de alumínio e suporte a QMK/VIA.','Periféricos',1299.00,'http://localhost:3000/img/30.jpg',2),
(14,'Teclado Razer Huntsman V3 Pro TKL','Teclado tenkeyless com switches ópticos analógicos, rapid trigger e RGB Chroma.','Periféricos',1499.00,'http://localhost:3000/img/31.webp',2),
(15,'Webcam Logitech Brio 4K','Webcam 4K com HDR, autofoco e microfone embutido, ideal para streaming e conteúdo.','Streaming',899.00,'http://localhost:3000/img/32.jpg',3),
(16,'Microfone Elgato Wave:3','Microfone condensador USB com Clipguard, software Wave Link e qualidade de broadcast.','Streaming',999.00,'http://localhost:3000/img/33.jpg',2),
(17,'Capture Card Elgato 4K60 Pro MK.2','Placa de captura PCI-E 4K60 HDR10 com latência ultra baixa para streaming profissional.','Streaming',1899.00,'http://localhost:3000/img/34.webp',1),
(18,'Ring Light Elgato Key Light Air','Iluminação LED profissional com temperatura de cor ajustável e controle via app.','Streaming',799.00,'http://localhost:3000/img/35.webp',3),
(19,'Cadeira Gamer DXRacer Formula','Cadeira ergonômica com espuma de alta densidade, apoio lombar e reclinação até 135°.','Móveis',1899.00,'http://localhost:3000/img/36.png',2),
(20,'Cadeira Secretlab Titan Evo 2022','Cadeira premium com espuma Cold-Cure, Magnetic Memory Foam Pillow e até 180kg de suporte.','Móveis',3499.00,'http://localhost:3000/img/37.webp',1),
(21,'Monitor Gamer LG UltraGear 27" 1440p 165Hz','Monitor IPS 27 polegadas com 1ms, FreeSync Premium e HDR10.','Monitores',1899.00,'http://localhost:3000/img/38.webp',3),
(22,'Monitor Samsung Odyssey G7 32" 240Hz','Monitor curvo 1000R QLED 1440p com 1ms e taxa de atualização de 240Hz.','Monitores',2999.00,'http://localhost:3000/img/39.jpeg',2),
(23,'Monitor ASUS ROG Swift PG279QM 360Hz','Monitor esports 27" 1440p com 360Hz, G-Sync e tempo de resposta de 1ms.','Monitores',4499.00,'http://localhost:3000/img/40.webp',1),
(24,'SSD NVMe Samsung 990 Pro 2TB','SSD de alto desempenho com até 7450 MB/s de leitura, ideal para jogos e carregamentos rápidos.','Armazenamento',1099.00,'http://localhost:3000/img/41.webp',4),
(25,'SSD WD Black SN850X 1TB','SSD gaming com até 7300 MB/s e tecnologia Game Mode 2.0.','Armazenamento',699.00,'http://localhost:3000/img/42.avif',5),
(26,'HD Externo Seagate Expansion 4TB','HD portátil USB 3.0 com 4TB de capacidade para backup de jogos e mídia.','Armazenamento',549.00,'http://localhost:3000/img/43.jpg',3),
(27,'Placa de Vídeo RTX 4070 Super 12GB','GPU NVIDIA Ada Lovelace com DLSS 3.5 e ray tracing de última geração.','Hardware',4299.00,'http://localhost:3000/img/44.avif',2),
(28,'Placa de Vídeo RX 7800 XT 16GB','GPU AMD RDNA 3 com 16GB GDDR6, excelente custo-benefício em 1440p.','Hardware',3599.00,'http://localhost:3000/img/67.webp',2),
(29,'Processador AMD Ryzen 7 7800X3D','CPU com cache 3D V-Cache, o melhor processador para jogos no momento.','Hardware',2899.00,'http://localhost:3000/img/45.avif',3),
(30,'Processador Intel Core i7-14700K','CPU 20 núcleos (8P+12E) com alto desempenho em jogos e produtividade.','Hardware',2499.00,'http://localhost:3000/img/46.avif',2),
(31,'Memória RAM Corsair Vengeance 32GB (2x16) 6000MHz','Kit DDR5 CL30 otimizado para plataformas AMD e Intel.','Hardware',899.00,'http://localhost:3000/img/47.webp',4),
(32,'Fonte Corsair RM850x 850W 80 Plus Gold','Fonte modular com cabo zero RPM e 10 anos de garantia.','Hardware',999.00,'http://localhost:3000/img/48.webp',3),
(33,'Gabinete Lian Li O11 Dynamic EVO','Gabinete premium mid-tower com excelente airflow e suporte a watercooler.','Hardware',1299.00,'http://localhost:3000/img/49.webp',2),
(34,'Watercooler NZXT Kraken 360 RGB','Cooler líquido AIO 360mm com display LCD personalizável e RGB.','Hardware',1499.00,'http://localhost:3000/img/50.avif',2),
(35,'Console PlayStation 5 Slim 1TB','Console de nova geração com leitor de disco, 1TB SSD e DualSense incluso.','Consoles',3999.00,'http://localhost:3000/img/51.avif',3),
(36,'Console Xbox Series X 1TB','Console mais poderoso da Microsoft com 4K nativo e Quick Resume.','Consoles',4299.00,'http://localhost:3000/img/52.webp',2),
(37,'Nintendo Switch OLED 64GB','Versão OLED com tela de 7", suporte aprimorado e 64GB de armazenamento.','Consoles',2499.00,'http://localhost:3000/img/53.webp',4),
(38,'Steam Deck OLED 1TB','Handheld PC gaming com tela OLED 90Hz, 1TB SSD e performance aprimorada.','Consoles',5499.00,'http://localhost:3000/img/54.jpg',1),
(39,'Jogo Elden Ring Shadow of the Erdtree (PS5)','Expansão oficial do game of the year + jogo base em mídia física.','Jogos',349.90,'http://localhost:3000/img/55.webp',5),
(40,'Jogo Black Myth: Wukong (PC)','Action RPG baseado em Mitologia Chinesa com gráficos Unreal Engine 5.','Jogos',299.90,'http://localhost:3000/img/66.jpeg',4),
(41,'Jogo Zelda: Tears of the Kingdom (Switch)','Aventura open-world aclamada pela crítica com mecânicas inovadoras.','Jogos',349.90,'http://localhost:3000/img/56.jpg',3),
(42,'Jogo Call of Duty: Black Ops 6 (PS5)','FPS moderno com campanha, multiplayer e modo Zombies.','Jogos',349.90,'http://localhost:3000/img/57.jpg',4),
(43,'Jogo EA Sports FC 25 (PS5)','Simulador de futebol oficial com HyperMotionV e Ultimate Team.','Jogos',299.90,'http://localhost:3000/img/58.jpg',5),
(44,'Assinatura PlayStation Plus Extra 12 meses','Acesso a catálogo de jogos, multiplayer online e descontos exclusivos.','Assinaturas',399.90,'http://localhost:3000/img/59.webp',10),
(45,'Assinatura Xbox Game Pass Ultimate 12 meses','Mais de 100 jogos + EA Play + cloud gaming e multiplayer.','Assinaturas',499.90,'http://localhost:3000/img/60.webp',8),
(46,'Assinatura Nintendo Switch Online + Expansion 12m','Acesso a clássicos N64, Genesis e multiplayer online.','Assinaturas',249.90,'http://localhost:3000/img/61.webp',6),
(47,'Gift Card Steam R$100','Crédito digital para a maior plataforma de jogos de PC do mundo.','Gift Cards',100.00,'http://localhost:3000/img/62.jpeg',20),
(48,'Gift Card PlayStation Store R$100','Crédito para comprar jogos, DLCs e assinaturas na PS Store.','Gift Cards',100.00,'http://localhost:3000/img/63.avif',15),
(49,'Base de Carregamento DualSense','Carregador oficial para dois controles DualSense simultaneamente.','Acessórios',249.90,'http://localhost:3000/img/64.avif',4),
(50,'Case de Transporte Steam Deck','Case rígida oficial com interior acolchoado e bolso para acessórios.','Acessórios',299.00,'http://localhost:3000/img/65.jpeg',3);
`
const ESTRUTURA_COMPRA = `
DROP TABLE IF EXISTS item_compra;
DROP TABLE IF EXISTS compra;

CREATE TABLE compra (
    id INT NOT NULL AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    forma_pagamento VARCHAR(50) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE item_compra (
    id INT NOT NULL AUTO_INCREMENT,
    id_compra INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_compra) REFERENCES compra(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produto(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
async function criar_tabelas() {
    const connection = await db.pool.getConnection();
    try {
        await connection.beginTransaction();

        console.log("Criando tabela 'cliente'...");
        await connection.query(ESTRUTURA_CLIENTE);
        await connection.query(DADOS_CLIENTE);

        console.log("Criando tabela 'produto'...");
        await connection.query(ESTRUTURA_PRODUTO);
        await connection.query(DADOS_PRODUTO);         

        await connection.commit();
        console.log("Migration executada com sucesso!");
        process.exit(0);
    } catch (error) {
        await connection.rollback();
        console.log(error)
        process.exit(1);
    } finally {
        connection.release();
    }
}
criar_tabelas()