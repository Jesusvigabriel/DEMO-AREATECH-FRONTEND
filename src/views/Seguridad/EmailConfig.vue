<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <SelectorEmpresa @eligioEmpresa="onEmpresaSelected" />
      </v-col>
    </v-row>
    <v-form ref="form">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Nombre" label="Nombre" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Host" label="Host" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Puerto" label="Puerto" type="number" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Usuario" label="Usuario" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Password" label="Password" type="password" />
        </v-col>
        <v-col cols="12" md="4">
          <v-checkbox v-model="emailServer.SSL" label="Usar SSL/TLS" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="emailServer.EmailDesde" label="Email Desde" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="emailServer.NombreDesde" label="Nombre Desde" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex">
          <v-btn color="primary" class="mr-2" @click="saveServer">Guardar</v-btn>
          <v-btn color="error" class="mr-2" @click="deleteServer">Eliminar</v-btn>
          <v-btn color="success" @click="testServer">Probar</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row class="mt-8">
      <v-col cols="12">
        <v-data-table :headers="templateHeaders" :items="templates" class="elevation-3">
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn color="primary" @click="createTemplate">Nueva plantilla</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.acciones="{ item }">
            <v-icon small class="mr-2" @click="editTemplate(item)">mdi-pencil</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="templateDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Plantilla de Email</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="template.Codigo" label="Código" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="template.Asunto" label="Asunto" />
            </v-col>
          </v-row>
          <quill-editor
            ref="editor"
            v-model="template.CuerpoHtml"
            :options="editorOptions"
          />
          <small>Puede usar variables como {{nombreDestino}}, {{fecha}}, etc.</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeTemplate">Cerrar</v-btn>
          <v-btn text color="primary" @click="saveTemplate">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import emailServers from '@/store/emailServers'
import emailTemplates from '@/store/emailTemplates'
import { servicecAWS } from '@/helpers/uploadS3'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'

export default {
  name: 'EmailConfig',
  components: { SelectorEmpresa, quillEditor },
  data () {
    return {
      selectedEmpresa: null,
      emailServer: {
        Nombre: '',
        Host: '',
        Puerto: '',
        Usuario: '',
        Password: '',
        SSL: false,
        EmailDesde: '',
        NombreDesde: ''
      },
      templates: [],
      templateHeaders: [
        { text: 'Código', value: 'Codigo' },
        { text: 'Asunto', value: 'Asunto' },
        { text: 'Activo', value: 'Activo' },
        { text: '', value: 'acciones' }
      ],
      templateDialog: false,
      template: {
        Id: null,
        Codigo: '',
        Asunto: '',
        CuerpoHtml: ''
      },
      editorOptions: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline'],
              ['link', 'image']
            ],
            handlers: {
              image: function () {
                const input = document.createElement('input')
                input.setAttribute('type', 'file')
                input.setAttribute('accept', 'image/*')
                input.click()
                input.onchange = async () => {
                  const file = input.files[0]
                  if (!file) return
                  const nameFile = Date.now() + '_' + file.name
                  try {
                    await servicecAWS.uploadToS3(file, nameFile)
                    const url = `https://s3.amazonaws.com/a54-choferes-fotos-documentacion-entrega/${nameFile}`
                    const range = this.quill.getSelection(true)
                    this.quill.insertEmbed(range.index, 'image', url)
                  } catch (e) {
                    console.error(e)
                  }
                }
              }
            }
          }
        },
        theme: 'snow'
      }
    }
  },
  methods: {
    async onEmpresaSelected (id) {
      this.selectedEmpresa = id
      try {
        this.emailServer = await emailServers.getOne(id)
      } catch (e) {
        this.emailServer = {
          Nombre: '',
          Host: '',
          Puerto: '',
          Usuario: '',
          Password: '',
          SSL: false,
          EmailDesde: '',
          NombreDesde: ''
        }
      }
      try {
        this.templates = await emailTemplates.getByCode(id)
      } catch (e) {
        this.templates = []
      }
    },
    async saveServer () {
      if (!this.selectedEmpresa) return
      await emailServers.save(this.selectedEmpresa, this.emailServer)
    },
    async deleteServer () {
      if (!this.selectedEmpresa) return
      await emailServers.delete(this.selectedEmpresa)
      this.emailServer = {}
    },
    async testServer () {
      if (!this.selectedEmpresa) return
      await emailServers.test(this.selectedEmpresa, this.emailServer)
    },
    createTemplate () {
      this.template = { Id: null, Codigo: '', Asunto: '', CuerpoHtml: '' }
      this.templateDialog = true
    },
    editTemplate (item) {
      this.template = { ...item }
      this.templateDialog = true
    },
    closeTemplate () {
      this.templateDialog = false
    },
    async saveTemplate () {
      if (this.template.Id) {
        await emailTemplates.update(this.template.Id, this.template)
      } else {
        await emailTemplates.create(this.template)
      }
      this.templateDialog = false
      this.templates = await emailTemplates.getByCode(this.selectedEmpresa)
    }
  }
}
</script>

<style scoped>
</style>
