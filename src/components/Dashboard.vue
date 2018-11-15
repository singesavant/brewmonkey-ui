// -*- mode: vue; js-indent-level: 2; -*-

<template lang="html">

  <b-container fluid class="full-height">

  <div class="dashboard">
    <b-alert :show="error"
             dismissible
             variant="danger">
      <p v-if="error" v-html="error"></p>
    </b-alert>

    <div>
      <b-button-toolbar key-nav  aria-label="Toolbar with button groups">

        <b-dropdown id="ddown1" class="m-md-2" variant="info">
        <template slot="button-content">
          <font-awesome-icon icon='cog' />&nbsp;
          <span v-if="current_configuration">{{ current_configuration.name }}</span>
        </template>
        <b-dropdown-item v-on:click="changeConfiguration(key)" v-for="(configuration, key) in configurations" :key="key">
          {{ configuration.name }}
        </b-dropdown-item>
        </b-dropdown>


      </b-button-toolbar>
    </div>


  </div>

  <div v-if="current_configuration != null" class="vessels">
    <b-card-group deck class="mb-3">

      <!-- RESERVOIR -->
      <b-card no-body class="reservoir text-center">

        <b-card-header>
          <h2><font-awesome-icon icon='tint' /> <br/>Réservoir</h2>
        </b-card-header>

        <b-card-body class="tank-hlt-body" align-v="end">

          <div class="water"></div>

          <b-row align-self="start" no-gutters>
            <b-col cols="6" offset="6">
              <!-- temp badge -->
              <b-badge variant="info" class="temp-badge">
                <span class="current_temp" v-if="current_configuration.sensors.reservoir">
                  <font-awesome-icon icon='thermometer-half'/>&nbsp;{{ temperatures[current_configuration.sensors.reservoir] || '??' }}°C
                </span>
                <span class="current_temp" v-else variant="dark"><font-awesome-icon icon='times-circle'/></span>

                <hr/>

                <b-input-group>
                  <b-input-group-prepend is-text>
                    <strong>SV</strong>
                  </b-input-group-prepend>

                  <b-form-input style="width: 20%" v-model="fridgeSet" type="number" min="0.0" step="0.1" :value="temperatures['FridgeSet']"></b-form-input>
                  <b-input-group-append>
                    <b-btn v-on:click="setFridgeSetpoint" variant="dark"><font-awesome-icon icon='check'/></b-btn>
                  </b-input-group-append>
                </b-input-group>
              </b-badge>
              </b-col>
            </b-row>


          <b-row align-self="end">
            <b-col cols="6" >

              <!-- volume badge -->
              <b-button-group>
                <span class="current_volume" v-if="current_configuration.sensors.reservoir">
                  <font-awesome-icon icon='tint'/>&nbsp;{{ hlt.volume/10.0 || '??' }}L

                  <b-button-group vertical>
                    <b-button v-if="hlt.fill_target == 0" variant="dark" v-b-modal.fillhlt><font-awesome-icon icon='sign-in-alt'/>&nbsp;Remplir</b-button>
                    <div v-else>
                      <b-progress :value="hlt.volume/10.0" :max="hlt.fill_target/10.0" show-value animated></b-progress>
                      <b-button variant="danger" @click="fillHltTo(0)">Annuler !</b-button>
                    </div>

                    <!-- <b-button variant="dark"><font-awesome-icon icon='sign-out-alt'/>&nbsp;Transférer</b-button> -->
                  </b-button-group>

                  <!-- Modal Component -->
                  <b-modal @ok="fillHltTo()" id="fillhlt" title="Remplir HLT jusqu'à...">
                    <b-input-group>
                      <b-form-input style="width: 20%" v-model="hlt_fill_target" type="number" min="0" step="1" max="1000"></b-form-input>
Litres
                    </b-input-group>
                  </b-modal>

                </span>
              </b-button-group>

            </b-col>
            </b-row>

        </b-card-body>

        <b-card-footer>
          <b-badge v-if="current_configuration.kettles['reservoir'] == 'auto'" variant="info"><font-awesome-icon icon='microchip'/> Contrôle Auto</b-badge>
          <b-badge v-else-if="current_configuration.kettles['reservoir'] == 'manual'" variant="warning"><font-awesome-icon icon='hand-paper'/> Contrôle Manuel</b-badge>
          <b-badge v-else variant="dark"><font-awesome-icon icon='times-circle'/> Désactivé</b-badge>
        </b-card-footer>


      </b-card>

      <!-- MT -->
      <b-card 
              class="mashtun"
              border-variant="dark"
              no-body>

        <b-card-header>
          <h2><font-awesome-icon icon='stroopwafel' /> <br/>Empatage</h2>
        </b-card-header>

        <b-card-body>
          <b-row>
            <b-col>
              <span class="current_temp" v-if="current_configuration.sensors.mt">{{ temperatures[current_configuration.sensors.mt] || '??' }}°C</span>
              <span class="current_temp" v-else><font-awesome-icon icon="times-circle" /></span>
            </b-col>
          </b-row>

          <b-row v-if="current_configuration.kettles.hlt == 'auto'" class=" justify-content-center">
            <b-col cols=8>
              <b-input-group>
                <b-input-group-prepend is-text>
                  <strong><font-awesome-icon icon='thermometer-half'/>&nbsp;cible</strong>
                </b-input-group-prepend>
                <b-form-input v-model="beerSet" type="number" min="0.00" step="0.1" :value="temperatures['BeerSet']"></b-form-input>
                <b-input-group-append>
                  <b-btn v-on:click="setBeerSetpoint" variant="info">Appliquer</b-btn>
                </b-input-group-append>
          </b-input-group>
            </b-col>
          </b-row>
        </b-card-body>

        <b-card-footer>
          <b-badge v-if="current_configuration.kettles['hlt'] == 'auto'" variant="info"><font-awesome-icon icon='microchip'/> Contrôle Auto</b-badge>
          <b-badge v-else-if="current_configuration.kettles['hlt'] == 'manual'" variant="warning"><font-awesome-icon icon='hand-paper'/> Contrôle Manuel</b-badge>
          <b-badge v-else variant="dark"><font-awesome-icon icon='times-circle'/> Désactivé</b-badge>

          &nbsp;
          <span v-if="current_configuration.sensors.hlt"><strong>HLT</strong>: <font-awesome-icon icon="thermometer-half" /> <strong>{{ temperatures[current_configuration.sensors.hlt] }}°C</strong> <i v-if="current_configuration.kettles['hlt'] == 'auto' && temperatures[current_configuration.sensors['hlt']]">/ {{ temperatures['FridgeSet'] }}°C</i></span>
        </b-card-footer>

      </b-card>

      <!-- BK -->
      <b-card no-body class="bk" border-variant="dark">

        <b-card-header>
          <h2><font-awesome-icon icon='fire' /> <br/>Ebullition</h2>
        </b-card-header>

        <b-card-body>
          <b-row>
            <b-col>
              <span class="current_temp" v-if="current_configuration.sensors.bk">{{ temperatures[current_configuration.sensors.bk] || '??' }}°C</span>
              <span class="current_temp" v-else><font-awesome-icon icon="times-circle" /></span>
            </b-col>
          </b-row>

          <b-row v-if="current_configuration.kettles.bk == 'auto'" class=" justify-content-center">
            <b-col cols=8>
              <b-input-group>
                <b-input-group-prepend is-text>
                  <strong><font-awesome-icon icon='thermometer-half'/>&nbsp;cible</strong>
                </b-input-group-prepend>

                <b-form-input v-model="fridgeSet" type="number" min="0.00" step="0.1" :value="temperatures['FridgeSet']"></b-form-input>

                <b-input-group-append>
                  <b-btn v-on:click="setFridgeSetpoint" variant="info">Appliquer</b-btn>
                </b-input-group-append>

              </b-input-group>
            </b-col>
          </b-row>
        </b-card-body>

        <b-card-footer>
          <b-badge v-if="current_configuration.kettles['bk'] == 'auto'" variant="info"><font-awesome-icon icon='microchip'/> Contrôle Auto</b-badge>
          <b-badge v-else-if="current_configuration.kettles['bk'] == 'manual'" variant="warning"><font-awesome-icon icon='hand-paper'/> Contrôle Manuel</b-badge>
          <b-badge v-else variant="dark"><font-awesome-icon icon='times-circle'/> Désactivé</b-badge>

          &nbsp;
          <span v-if="current_configuration.sensors.cfc"><strong>CFC</strong>: <font-awesome-icon icon="thermometer-half" /> <strong>{{ temperatures[current_configuration.sensors.cfc] }}°C</strong></i></span>

        </b-card-footer>


      </b-card>

    </b-card-group>
  </div>

  <b-alert :show="info != null" variant="info">{{ info }}</b-alert>


  </b-container>

</template>

<script lang="js">

var configurations = {
  'off': {
    name: 'Arrêt',
    'sensors': {},
    'kettles': {reservoir: 'disabled', hlt: 'disabled', mt: 'disabled', bk: 'disabled'}
  },
  'preheat': {
    name: 'Préchauffe',
    'sensors': {hlt: 'FridgeTemp', mt: 'BeerTemp', reservoir: 'Log1Temp'},
    'kettles': {reservoir: 'disabled', hlt: 'auto', mt: 'auto', bk: 'disabled'}
  },
  'reservoir': {
    name: 'Chauffe-eau',
    'sensors': {reservoir: 'FridgeTemp', mt: 'Log1Temp', bk: 'Log2Temp', cfc: 'Log3Temp'},
    'kettles': {reservoir: 'auto', hlt: 'disabled', mt: 'disabled', bk: 'disabled'}
  },
  'mash': {
    'name': 'Empatage',
    'sensors': {hlt: 'FridgeTemp', mt: 'BeerTemp', reservoir: 'Log1Temp'},
    'kettles': {reservoir: 'manual', hlt: 'auto', mt: 'auto', bk: 'disabled'}
  },
  'boil': {
    'name': 'Ebullition',
    'sensors': {reservoir: 'Log1Temp', hlt: 'Log2Temp', cfc: 'Log3Temp', bk: 'FridgeTemp'},
    'kettles': {reservoir: 'manual', mt: 'disabled', hlt: 'manual', bk: 'auto'}
  }
}

export default {
  name: 'dashboard',
  data () {
    return {
      msg: 'BrewMonkey Dashboard',
      configurations: configurations,
      current_configuration: null,
      temperatures: {},
      hlt: {},
      hlt_fill_target: 0,
      info: null,
      error: false,
      beerSet: null,
      fridgeSet: null
    }
  },

  mounted () {
    // Fetch current configuration
    this.$http.get('/configuration')
      .then((response) => {
        console.debug('Guessed configuration successfully!')
        if (response.data.configuration in this.configurations) {
          this.current_configuration = this.configurations[response.data.configuration]
        } else {
          this.error = 'Couldn\'t guess configuration, switch to a new one!'
        }
      })
      .catch((error) => { this.error = error })

    // Set temperature poller
    this.interval = setInterval(function () {
      this.refreshTemperatures()
    }.bind(this), 2000)

    // Set temperature poller
    this.interval = setInterval(function () {
      this.refreshHLT()
    }.bind(this), 2000)
  },

  methods: {
    fillHltTo: function (target = null) {
      if (target == null) {
        target = this.hlt_fill_target
      }

      this.$http.post('/hlt', {'target_liters': target})
        .catch((error) => { this.error = error.data })
    },

    setBeerSetpoint: function () {
      this.$http.post('/temp', {'beer': this.beerSet})
        .catch((error) => { this.error = error.data })
    },

    setFridgeSetpoint: function () {
      this.$http.post('/temp', {'fridge': this.fridgeSet})
        .catch((error) => { this.error = error })
    },

    refreshTemperatures: function () {
      // console.debug('Refreshing temps...')
      this.$http.get('/temp')
        .then((response) => {
          this.temperatures = response.data
        })
    },

    refreshHLT: function () {
      // console.debug('Refreshing HLT...')
      this.$http.get('/hlt')
        .then((response) => {
          this.hlt = response.data
        })
    },

    changeConfiguration: function (configurationName) {
      console.debug('Changing configuration to...' + configurationName)

      this.$http.post('/configuration', {'name': configurationName})
        .then((response) => {
          this.current_configuration = this.configurations[configurationName]
        })
        .catch((error) => { this.error = error })
    }
  }

}

</script>

<style scoped>

.temp-badge {
    padding: 20px;
}


.water {
    position: absolute;
    background-color: #1CA3EC;
    height: 20%;
    width: 100%;
    margin: none;
    padding: none;
    left: 0% !important;

    bottom: 0;
}

.tank-hlt-body {
    position: relative;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.reservoir, .mashtun, .bk {
  border: 3px solid #333;
  border-radius: 10px;
  font-size: 20px;

  height: 70vh;
}

h3 {
  margin-top: 20px;
}

.current_temp, .current_volume {
  font-size: 2em;
  font-weight: bold;
}

</style>
