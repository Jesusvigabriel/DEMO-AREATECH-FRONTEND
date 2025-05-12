<template>
    <v-container>      
        <!--  color="#337ab7" -->  
        <v-app-bar app color="primary" dark dense data-cy="TituloMenuPrincipal">
            <v-app-bar-nav-icon id='BotonAbrirMenu' @click="MostrarMenuLateral=true"></v-app-bar-nav-icon>
            <v-toolbar-title class="pl-0 mr-3">
                <v-img :src="nombreLogo" contain width="30" class=""></v-img>
            </v-toolbar-title>
            {{tituloPrincipalAMostrar}}
             - V {{getNumeroVersion()}}
            <v-spacer></v-spacer>
            <v-toolbar-title v-if="estaLoggeado" class="px-0 mx-0" ><v-icon color="black" class="mr-1" data-cy='IconoSesionIniciada'  >mdi-account</v-icon>{{nombreUsuario}}</v-toolbar-title>
        </v-app-bar>    
        
        <v-navigation-drawer v-model="MostrarMenuLateral" absolute temporary width="300">
            <v-list-item>
                <v-list-item-avatar class="custom-avatar"><v-img :src="nombreLogo"></v-img></v-list-item-avatar>
                <v-list-item-content><v-list-item-title>{{NombreQuienSoy}}</v-list-item-title></v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense>
                <!-- <router-link to="/ImprimirStickersGuia/923354|922643|922644|922645|922646" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/StockIngreso" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Productos/ABM" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Informes/OrdenesSalida" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Guias/GenerarDesdeExcel" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Informes/Tracking" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Guias/GenerarDesdeOrdenes" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Posiciones/VerPosiciones" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Informes/GuiasPorPeriodo" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Informes/AlmacenajePorPeriodo" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/OrdenesSalida" v-if="estoyEnFuente"> -->
                <!-- <router-link to="/Empresas/ConfiguracionMasiva" v-if="estoyEnFuente"> -->
                <router-link to="/Stock/Conciliacion" v-if="estoyEnFuente">
                    <v-list-item link >
                        <v-icon class="mx-3" color="home">mdi-folder-hidden</v-icon>
                        <v-list-item-content>                            
                            <v-list-item-title>??????????</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </router-link>
                <span>{{ObtengoMenu}}</span>
                <router-link to="/">
                    <v-list-item link>
                        <v-icon class="mx-3" color="home">mdi-home-outline</v-icon>
                        <v-list-item-content>                            
                            <v-list-item-title>Home</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </router-link>

                <v-divider v-if="!estaLoggeado"></v-divider>
                <router-link to="/Login" v-if="!estaLoggeado">
                    <v-list-item link>
                        <v-icon class="mx-3" color="home">mdi-login</v-icon>
                        <v-list-item-content>
                            <v-list-item-title>Iniciar sesión</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </router-link>

                <v-expansion-panels>

                    <!-- Stock -->
                    <v-expansion-panel v-if="this.ListaDeMenusStock.length>0 && estaLoggeado">
                        <v-expansion-panel-header>
                            Stock
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>

                            <li v-for="menu in ListaDeMenusStock">
                            <router-link :to="{path: menu.ruta}" >
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">{{menu.icono}}</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{menu.nombre}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </li>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Stock -->
                    <!-- <v-expansion-panel v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('VerStock'))">
                        <v-expansion-panel-header>
                            Stock
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <router-link to="/Stock" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('VerStock'))">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-clipboard-list-outline</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Stock</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/Productos/ABM" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('GestionManualDeCatalogo'))">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-playlist-plus</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Catálogo de productos</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/StockIngreso" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-receipt</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title id="IngresoStock">Ingreso de stock</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/PosicionamientoStock" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-bookshelf</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Posicionamiento de stock</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/Reposicionamiento" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-folder-move-outline</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Reposicionamiento</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/VaciarPosicion" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-delete-empty-outline</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Vaciar posición</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/Inventario" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-table-search</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Inventario</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/Posiciones/VerPosiciones" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-library-shelves</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Posiciones</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/HistoricoPosiciones" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-format-list-bulleted-square</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Historico de Posiciones</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/Stock/Ajustes" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-book-edit-outline</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Ajustes</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/Stock/Conciliacion" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="ingresos">mdi-check</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Conciliación</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </v-expansion-panel-content>
                    </v-expansion-panel> -->

                     <!-- Órdenes -->
                     <v-expansion-panel v-if="this.ListaDeMenusOrdenes.length>0 && estaLoggeado">
                        <v-expansion-panel-header>
                            Órdenes
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>

                            <li v-for="menu in ListaDeMenusOrdenes">
                            <router-link :to="{path: menu.ruta}" >
                                <v-list-item link>
                                    <v-icon class="mx-3" color="egresos">{{menu.icono}}</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{menu.nombre}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </li>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Órdenes -->
                    <!-- <v-expansion-panel v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('ImportarOrdenesDesdeExcel'))">
                        <v-expansion-panel-header>
                            Órdenes
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <router-link to="/ImportacionOrdenes" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('ImportarOrdenesDesdeExcel'))">  
                                <v-list-item link>
                                    <v-icon class="mx-3" color="egresos">mdi-microsoft-excel</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Import. órdenes desde Excel</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/Ordenes/CreacionManual" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('OrdenesCreacionManual'))">  
                                <v-list-item link>
                                    <v-icon class="mx-3" color="egresos">mdi-newspaper-plus</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Creación manual</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/ImprimirOrdenes" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="egresos">mdi-tag-multiple-outline</v-icon>                                                             
                                    <v-list-item-content>
                                        <v-list-item-title>Imprimir órdenes</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/Stock" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="egresos">mdi-clipboard-list-outline</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Stock</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                            <router-link to="/OrdenesSalida" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="egresos">mdi-truck-delivery-outline</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Salida de órdenes</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </v-expansion-panel-content>
                    </v-expansion-panel> -->

                    <!-- Guías -->
                    <v-expansion-panel v-if="this.ListaDeMenusGuias.length>0 && estaLoggeado">
                        <v-expansion-panel-header>
                            Guías
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>

                            <li v-for="menu in ListaDeMenusGuias">
                            <router-link :to="{path: menu.ruta}" >
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">{{menu.icono}}</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{menu.nombre}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </li>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Guías -->
                    <!-- <v-expansion-panel  v-if="estaLoggeado && esUsuarioArea">
                        <v-expansion-panel-header>
                            Guías
                        </v-expansion-panel-header>

                        <v-expansion-panel-content> -->

                            <!-- Generar desde órdenes -->
                            <!-- <router-link to="/Guias/GenerarDesdeOrdenes" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-truck-check-outline</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Generar guías desde órdenes</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- Generar desde Excel -->
                            <!-- <router-link to="/Guias/GenerarDesdeExcel" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-microsoft-excel</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Generar guías desde Excel</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- <router-link to="/Guias/ActualizarFechas" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-calendar-refresh</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Actualizar fechas</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->
                            <!-- Digitalizacion OCR -->
                           <!-- <router-link to="/Guias/CargarNovedadesGuias" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-camera</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Cargar novedades</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- Generar rendiciones -->
                            <!-- <v-divider></v-divider>
                            <router-link to="/Guias/GenerarRendiciones" v-if="estaLoggeado && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-format-list-checks</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Generar rendiciones</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>

                        </v-expansion-panel-content>
                    </v-expansion-panel> -->

                    <!-- Informes -->
                    <v-expansion-panel v-if="this.ListaDeMenusInformes.length>0 && estaLoggeado">
                        <v-expansion-panel-header>
                            Informes
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>

                            <li v-for="menu in ListaDeMenusInformes">
                            <router-link :to="{path: menu.ruta}" >
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">{{menu.icono}}</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{menu.nombre}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </li>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <!-- Informes -->
                    <!-- <v-expansion-panel v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('InformeDeOrdenes') || autogestionOpcionHabilitada('InformeDeGuias') || autogestionOpcionHabilitada('InformeDeAlmacenaje'))">
                        <v-expansion-panel-header>
                            Informes
                        </v-expansion-panel-header>

                        <v-expansion-panel-content> -->

                            <!-- Órdenes por período/empresa -->
                            <!-- <router-link to="/Informes/OrdenesPorPeriodo" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('InformeDeOrdenes'))">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-calendar-range</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Órdenes</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- Guías por período/empresa -->
                            <!-- <router-link to="/Informes/GuiasPorPeriodo" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('InformeDeGuias'))">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-calendar-range</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Guías</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- Almacenaje por período/empresa -->
                            <!-- <router-link to="/Informes/AlmacenajePorPeriodo" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('InformeDeAlmacenaje'))">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-calendar-range</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Almacenaje</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- Facturacion -->
                            <!-- <router-link to="/Informes/Facturacion" v-if="estaLoggeado">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-calendar-range</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Facturacion</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- Tracking -->
                            <!-- <router-link to="/Informes/Tracking" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('InformeDeTracking'))">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-calendar-range</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Tracking</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- Ingresos -->
                            <!-- <router-link to="/Informes/Ingresos" v-if="estaLoggeado && (esUsuarioArea || autogestionOpcionHabilitada('InformeDeIngresos'))">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-calendar-range</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Ingresos</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>


                        </v-expansion-panel-content>
                    </v-expansion-panel> -->

 					<!-- Empresas -->
                    <v-expansion-panel v-if="this.ListaDeMenusEmpresas.length>0 && estaLoggeado">
                        <v-expansion-panel-header>
                            Empresas
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>

                            <li v-for="menu in ListaDeMenusEmpresas">
                            <router-link :to="{path: menu.ruta}" >
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">{{menu.icono}}</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{menu.nombre}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </li>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    
                    
                    <!-- Empresas -->
                    <!-- <v-expansion-panel v-if="estaLoggeado && permisoConfigurarValorizacion && esUsuarioArea">
                        <v-expansion-panel-header>
                            Empresas
                        </v-expansion-panel-header>

                        <v-expansion-panel-content> -->

                            <v-divider></v-divider>
                            <!-- Configuración de empresas -->
                            <!-- <router-link to="/Empresas/Configuracion" v-if="estaLoggeado && permisoConfigurarValorizacion && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-chart-bar</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Configuración de empresas</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                            <!-- Configuración masiva -->
                            <!-- <router-link to="/Empresas/ConfiguracionMasiva" v-if="estaLoggeado && permisoConfigurarValorizacion && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-playlist-check</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Configuración masiva</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>

                            <-- Historico de Aumentos 
                            <router-link to="/Empresas/HistoricoDeAumentos" v-if="estaLoggeado && permisoConfigurarValorizacion && esUsuarioArea">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-chart-line</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Historico de Aumentos</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>

                        </v-expansion-panel-content>
                    </v-expansion-panel>       -->
                    <!-- Seguridad -->
                    <!-- <v-expansion-panel>
                        <v-expansion-panel-header>
                            Seguridad
                        </v-expansion-panel-header>

                        <v-expansion-panel-content> -->

                            <v-divider></v-divider>
                            <!-- Usuarios -->
                            <!-- <router-link to="/Usuarios" v-if="estaLoggeado && permisoConfigurarValorizacion">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-account-box</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Usuarios</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                             <!-- Roles -->
                             <!-- <router-link to="/Roles" v-if="estaLoggeado">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-account-convert</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Roles</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link> -->

                             <!-- Asignacion de Roles -->
                             <!-- <router-link to="/AsignarRoles" v-if="estaLoggeado">
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">mdi-contacts</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Asignacón de roles</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>

                      
                        </v-expansion-panel-content>
                    </v-expansion-panel> -->

                    <!-- Prueba de Seguridad -->
                    <v-expansion-panel v-if="this.ListaDeMenusSeguridad.length>0 && estaLoggeado">
                        <v-expansion-panel-header>
                            Seguridad
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>

                            <li v-for="menu in ListaDeMenusSeguridad">
                            <router-link :to="{path: menu.ruta}" >
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">{{menu.icono}}</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{menu.nombre}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </li>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel v-if="this.ListaDeMenusTransportes.length>0 && estaLoggeado">
                        <v-expansion-panel-header>
                            Transportes
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>

                            <li v-for="menu in ListaDeMenusTransportes">
                            <router-link :to="{path: menu.ruta}" >
                                <v-list-item link>
                                    <v-icon class="mx-3" color="configuracion">{{menu.icono}}</v-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{menu.nombre}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </router-link>
                        </li>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                </v-expansion-panels>
                <v-divider></v-divider>


                <v-divider></v-divider>
                <router-link to="/Estadisticas" v-if="estaLoggeado && soyBogota">
                    <v-list-item link>
                        <v-icon class="mx-3" color="estadisticas">mdi-chart-bar</v-icon>
                        <v-list-item-content>
                            <v-list-item-title>Información estadística</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </router-link>

                <v-footer class="mb-10">
                    <router-link to="/Logout"  v-if="estaLoggeado">
                        <v-list-item link>
                            <v-icon class="mx-3" color="cerrarSesion" id="BotonCerrarSesion">mdi-logout</v-icon>
                            <v-list-item-content>
                                <v-list-item-title data-cy='BotonCerrarSesion'>Cerrar la sesión</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>
                </v-footer>
            </v-list>
        </v-navigation-drawer>
    </v-container>
</template>

<style scoped>
    a {
        text-decoration: none;
    }
    .custom-avatar {
        border-radius: 0;
    }
</style>

<script>

import store from '../store'
import roles from '@/store/roles'

export default {
    name: 'MenuPrincipal',
    props: {
        tituloPrincipal: String
    },
    methods: {
        getNumeroVersion() {
            var pjson = require('../../package.json')
            return pjson.version
        },
        autogestionOpcionHabilitada(nombreOpcion) {
            if (store.state.usuarios.usuarioActual.IdEmpresa<=0) {
                return true
            } else {
                if (!store.state.usuarios.usuarioActual.Empresa) {
                    return true
                } else {
                    return store.state.usuarios.usuarioActual.Empresa.AutogestionOpciones.indexOf(nombreOpcion)>=0

                }
            }
        },

        asignoOpcionDeMenu(){
            console.log(this.ListaDeMenus)
            
            
            for(const OpcionesMenu of this.ListaDeMenus){

                if(OpcionesMenu.modulo.includes("stock")){
                    this.ListaDeMenusStock.push(OpcionesMenu)

                 }else if(OpcionesMenu.modulo.includes("ordenes"))
                 {
                    this.ListaDeMenusOrdenes.push(OpcionesMenu)

                 }else if(OpcionesMenu.modulo.includes("guias"))
                 {
                    this.ListaDeMenusGuias.push(OpcionesMenu)

                 }else if(OpcionesMenu.modulo.includes("informes"))
                 {
                    this.ListaDeMenusInformes.push(OpcionesMenu)

                 }else if(OpcionesMenu.modulo.includes("empresas"))
                 {
                    this.ListaDeMenusEmpresas.push(OpcionesMenu)

                 }else if(OpcionesMenu.modulo.includes("seguridad"))
                 {
                    this.ListaDeMenusSeguridad.push(OpcionesMenu)

                 }else if(OpcionesMenu.modulo.includes("transportes"))
                 {
                    this.ListaDeMenusTransportes.push(OpcionesMenu)

                 }

            }
            
        }
    },
    computed: {
        esUsuarioArea() {
            // console.log(store.state.usuarios.usuarioActual)
            return store.state.usuarios.usuarioActual.IdEmpresa<=0
        },
        permisoConfigurarValorizacion() {
            const usuariosPermitidos=["JMartin", "Nahir", "Gaby", "Ighal", "Victor", "Anahi", "Jav", "Javi", "Karina"]
            const permiso=usuariosPermitidos.filter(e => e.toUpperCase()==store.state.usuarios.usuarioActual.Nombre.toUpperCase())
            return permiso.length>0
        },
        soyBogota() {
            return process.env.VUE_APP_Quien_Soy=='Bogota'
        },
        estaLoggeado() {
            return store.state.usuarios.usuarioActual.Loggeado
        },
        nombreUsuario() { 
            return store.state.usuarios.usuarioActual.Nombre
        },
        tituloPrincipalAMostrar() {
            return this.tituloPrincipal===null ? process.env.VUE_APP_Nombre : this.tituloPrincipal
        },
        estoyEnFuente() {
            return process.env.NODE_ENV=="development"
        },
        idUsuario(){
            return store.state.usuarios.usuarioActual.Id
        },
        ObtengoMenu(){
            this.ListaDeMenus=[]
            this.ListaDeMenusStock=[]
            this.ListaDeMenusOrdenes=[]
            this.ListaDeMenusGuias=[]
            this.ListaDeMenusInformes=[]
            this.ListaDeMenusEmpresas=[]
            this.ListaDeMenusSeguridad=[]
            this.ListaDeMenusTransportes=[]
            
            if(this.estaLoggeado  ){
            roles.getAllMenuUser(this.idUsuario)
            .then(respuesta => {
                    //console.log("Respuesta", respuesta);
                    this.ListaDeMenus=respuesta
                    this.asignoOpcionDeMenu()
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.ListaDeMenus=[]
                    //this.mostrarError(puteada)
                })
            }
            
        }
    },

    data() {
        return {
            MostrarMenuLateral: false,
            nombreLogo:require("../assets/IsoLogo_"+process.env.VUE_APP_Quien_Soy+".png"),
            NombreQuienSoy: process.env.VUE_APP_Nombre,
            ListaDeMenus:[],
            ListaDeMenusStock:[],
            ListaDeMenusOrdenes:[],
            ListaDeMenusGuias:[],
            ListaDeMenusInformes:[],
            ListaDeMenusEmpresas:[],
            ListaDeMenusSeguridad:[]
        }
    }
}
</script>