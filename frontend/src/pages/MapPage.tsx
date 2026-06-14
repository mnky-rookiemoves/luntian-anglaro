/**
 * 🗺️ LUNTIAN ANGLARO — Interactive Map Page
 */

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store';
import PhilippinesMap from '@/components/map/PhilippinesMap';
import RegionDetail from '@/components/map/RegionDetail';
import type { Region } from '@/types/game.types';

const MapPage = () => {
  const { regions, guardians, generals, initialize, isInitialized, language } = useGameStore();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [initialize, isInitialized]);

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region);
  };

  const getGuardianForRegion = (region: Region) =>
    guardians.find((g) => g.region_name === region.name);

  const getGeneralForRegion = (region: Region) =>
    generals.find((g) => g.region_name === region.name);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[var(--luntian-primary-light)] mb-2">
        🗺️ {language === 'en' ? 'Map of the Philippines' : 'Mapa ng Pilipinas'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-6">
        {language === 'en'
          ? 'Click on a region to view its environmental status and discover its Guardian and General.'
          : 'Pindutin ang isang rehiyon para makita ang estado ng kalikasan at matuklasan ang Guardian at General nito.'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Map */}
        <div>
          <PhilippinesMap
            regions={regions}
            onRegionClick={handleRegionClick}
            activeRegionId={selectedRegion?.id ?? null}
          />

          {/* Quick region list (below map) */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {(Array.isArray(regions) ? regions : []).map((r) => (
              <button
                key={r.id}
                onClick={() => handleRegionClick(r)}
                className={`text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  selectedRegion?.id === r.id
                    ? 'bg-[var(--luntian-primary)]/20 border border-[var(--luntian-primary)]/40 text-[var(--luntian-primary-light)]'
                    : 'bg-[var(--luntian-surface)] border border-transparent text-[var(--luntian-text-muted)] hover:bg-[var(--luntian-primary)]/10'
                }`}
              >
                <div className="font-medium">
                  {language === 'fil' && r.name_filipino ? r.name_filipino : r.name}
                </div>
                <div className="text-[10px] opacity-60">
                  Saga {r.saga} • Ch.{r.chapter_number}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Region Detail Panel */}
        <div>
          {selectedRegion ? (
            <RegionDetail
              region={selectedRegion}
              guardian={getGuardianForRegion(selectedRegion)}
              general={getGeneralForRegion(selectedRegion)}
              language={language}
              onClose={() => setSelectedRegion(null)}
            />
          ) : (
            <div className="rounded-2xl border border-[var(--luntian-primary)]/20 bg-[var(--luntian-surface)] p-12 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-[var(--luntian-text-muted)] mb-2">
                {language === 'en' ? 'Select a Region' : 'Pumili ng Rehiyon'}
              </h3>
              <p className="text-sm text-[var(--luntian-text-muted)]/60">
                {language === 'en'
                  ? 'Click on the map or the buttons below to explore a region\'s environmental status.'
                  : 'Pindutin ang mapa o ang mga button sa ibaba para tuklasin ang estado ng kalikasan ng rehiyon.'}
              </p>

              {/* Quick stats */}
              <div className="flex justify-center gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--luntian-primary-light)]">{regions.length}</div>
                  <div className="text-[10px] text-[var(--luntian-text-muted)]">{language === 'en' ? 'Regions' : 'Rehiyon'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--luntian-gold)]">{guardians.length}</div>
                  <div className="text-[10px] text-[var(--luntian-text-muted)]">{language === 'en' ? 'Guardians' : 'Tagapag-alaga'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{generals.length}</div>
                  <div className="text-[10px] text-[var(--luntian-text-muted)]">{language === 'en' ? 'Generals' : 'Heneral'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;