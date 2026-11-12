// ============================================================
//  ZONA FINALE (WinZone)
//  Entrandoci si vince, se gli obiettivi obbligatori sono completi.
//
//  DOVE SI METTE
//    Trascina PF_Kit_ZonaFinale e ridimensionala. Nella Scene si vede verde.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Niente da configurare: usa gli Objective della scena e il GameManager.
//
//  COME SI COLLEGA
//    Se gli obiettivi non sono completi il GameManager mostra il suo Not Ready Message.
//
//  ESEMPIO
//    Mettila davanti alla statua del dio.
// ============================================================
using UnityEngine;

/// <summary>Zona finale: se tutti gli obiettivi obbligatori sono completi, il giocatore vince.</summary>
[RequireComponent(typeof(Collider))]
public class WinZone : MonoBehaviour
{
    void Reset() { GetComponent<Collider>().isTrigger = true; }
    void OnTriggerEnter(Collider other) { if (PlayerController.IsPlayer(other)) GameManager.Instance?.TryWin(); }
    void OnDrawGizmos() { KitGizmos.DrawZone(GetComponent<Collider>(), new Color(0.3f, 1f, 0.3f, 0.25f)); }
}
