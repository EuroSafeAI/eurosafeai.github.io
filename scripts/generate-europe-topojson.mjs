/**
 * Generates public/data/europe-50m.json from world-atlas 50m data.
 * Filters to European countries and prunes unused arcs for minimal file size.
 * Run once: node scripts/generate-europe-topojson.mjs
 */
import { execSync } from 'child_process'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Install world-atlas temporarily if not present
const worldAtlasPath = join(root, 'node_modules', 'world-atlas')
try {
  readFileSync(join(worldAtlasPath, 'countries-50m.json'))
  console.log('world-atlas found')
} catch {
  console.log('Installing world-atlas...')
  execSync('npm install --no-save world-atlas', { cwd: root, stdio: 'inherit' })
}

const raw = readFileSync(join(worldAtlasPath, 'countries-50m.json'), 'utf-8')
const world = JSON.parse(raw)

// ISO numeric codes for European countries (UN M.49)
const EUROPEAN_NUMERIC = new Set([
  8,   // Albania
  20,  // Andorra
  40,  // Austria
  112, // Belarus
  56,  // Belgium
  70,  // Bosnia and Herzegovina
  100, // Bulgaria
  191, // Croatia
  196, // Cyprus
  203, // Czechia
  208, // Denmark
  233, // Estonia
  246, // Finland
  250, // France
  276, // Germany
  300, // Greece
  348, // Hungary
  352, // Iceland
  372, // Ireland
  380, // Italy
  428, // Latvia
  438, // Liechtenstein
  440, // Lithuania
  442, // Luxembourg
  470, // Malta
  498, // Moldova
  492, // Monaco
  499, // Montenegro
  528, // Netherlands
  807, // North Macedonia
  578, // Norway
  616, // Poland
  620, // Portugal
  642, // Romania
  674, // San Marino
  688, // Serbia
  703, // Slovakia
  705, // Slovenia
  724, // Spain
  752, // Sweden
  756, // Switzerland
  804, // Ukraine
  826, // United Kingdom
  336, // Vatican City
  383, // Kosovo
  792, // Turkey (geographic completeness)
  643, // Russia (geographic completeness)
])

// Filter geometries to European countries
const europeanGeometries = world.objects.countries.geometries.filter(
  (g) => EUROPEAN_NUMERIC.has(Number(g.id))
)

// ── Prune unused arcs ──────────────────────────────────────────────────────

// Collect all arc indices referenced by European geometries
function collectArcs(geometry, usedSet) {
  if (!geometry) return
  switch (geometry.type) {
    case 'GeometryCollection':
      geometry.geometries.forEach(g => collectArcs(g, usedSet))
      break
    case 'Polygon':
      geometry.arcs.forEach(ring => ring.forEach(i => usedSet.add(i < 0 ? ~i : i)))
      break
    case 'MultiPolygon':
      geometry.arcs.forEach(poly => poly.forEach(ring => ring.forEach(i => usedSet.add(i < 0 ? ~i : i))))
      break
    case 'LineString':
      geometry.arcs.forEach(i => usedSet.add(i < 0 ? ~i : i))
      break
    case 'MultiLineString':
      geometry.arcs.forEach(ring => ring.forEach(i => usedSet.add(i < 0 ? ~i : i)))
      break
  }
}

const usedArcIndices = new Set()
europeanGeometries.forEach(g => collectArcs(g, usedArcIndices))

// Build old→new index mapping
const oldToNew = new Map()
let newIndex = 0
for (let i = 0; i < world.arcs.length; i++) {
  if (usedArcIndices.has(i)) {
    oldToNew.set(i, newIndex++)
  }
}

// Rewrite arc references in geometries
function remapArcs(geometry) {
  if (!geometry) return geometry
  switch (geometry.type) {
    case 'GeometryCollection':
      return { ...geometry, geometries: geometry.geometries.map(remapArcs) }
    case 'Polygon':
      return {
        ...geometry,
        arcs: geometry.arcs.map(ring =>
          ring.map(i => i < 0 ? ~oldToNew.get(~i) : oldToNew.get(i))
        ),
      }
    case 'MultiPolygon':
      return {
        ...geometry,
        arcs: geometry.arcs.map(poly =>
          poly.map(ring =>
            ring.map(i => i < 0 ? ~oldToNew.get(~i) : oldToNew.get(i))
          )
        ),
      }
    default:
      return geometry
  }
}

const remappedGeometries = europeanGeometries.map(remapArcs)
const prunedArcs = world.arcs.filter((_, i) => usedArcIndices.has(i))

const result = {
  type: 'Topology',
  bbox: world.bbox,
  transform: world.transform,
  objects: {
    countries: {
      type: 'GeometryCollection',
      geometries: remappedGeometries,
    },
  },
  arcs: prunedArcs,
}

const outDir = join(root, 'public', 'data')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, 'europe-50m.json')
const json = JSON.stringify(result)
writeFileSync(outPath, json)

// Check gzipped size
import('zlib').then(({ gzipSync }) => {
  const gz = gzipSync(json)
  console.log(`✓ Written ${outPath}`)
  console.log(`  Raw: ${Math.round(json.length / 1024)} KB`)
  console.log(`  Gzipped: ${Math.round(gz.length / 1024)} KB`)
  console.log(`  Countries: ${remappedGeometries.length}`)
  console.log(`  Arcs: ${prunedArcs.length} (pruned from ${world.arcs.length})`)
})
