// -*- mode: vue; js-indent-level: 2; -*-

<template lang="html">

  <b-container fluid>    

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

  <div v-if="current_configuration != null">
    <b-card-group deck class="mb-3">
      <!-- RESERVOIR -->
      <b-card no-body class="reservoir text-center">

        <b-card-header>
          <h2>          <font-awesome-icon icon='tint' /> <br/>Réservoir</h2>
        </b-card-header>

        <b-card-body>
          <span class="current_temp" v-if="current_configuration.sensors.reservoir">{{ temperatures[current_configuration.sensors.reservoir] || '??' }}°C</span>
          <span class="current_temp" v-else variant="dark"><font-awesome-icon icon='times-circle'/></span>

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
    'kettles': {reservoir: 'manual', hlt: 'auto', mt: 'auto', bk: 'disabled'}
  },
  'mash': {
    'name': 'Empatage',
    'sensors': {hlt: 'FridgeTemp', mt: 'BeerTemp', reservoir: 'Log1Temp'},
    'kettles': {reservoir: 'manual', hlt: 'auto', mt: 'auto', bk: 'disabled'}
  },
  'boil': {
    'name': 'Ebullition',
    'sensors': {reservoir: 'Log1Temp', hlt: 'Log2Temp', cfc: 'Log3Temp', bk: 'ChamberTemp'},
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
  },

  methods: {
    setBeerSetpoint: function () {
      this.$http.post('/temp', {'beer': this.beerSet})
        .catch((error) => { this.error = error.data })
    },

    setFridgeSetpoint: function () {
      this.$http.post('/temp', {'fridge': this.fridgeSet})
        .catch((error) => { this.error = error })
    },

    refreshTemperatures: function () {
      console.debug('Refreshing temps...')
      this.$http.get('/temp')
        .then((response) => {
          this.temperatures = response.data
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
}

h3 {
margin-top: 20px;
  }

.current_temp {
  font-size: 5vw;
  font-weight: bold;
}

</style>
